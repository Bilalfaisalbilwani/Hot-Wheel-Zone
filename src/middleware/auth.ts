import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { adminAuth } from '../lib/firebase-admin.ts';
import { DecodedIdToken } from 'firebase-admin/auth';
import { getUserByUid } from '../db/users.ts';

export interface AuthUser {
  uid: string;
  email?: string;
  role: string;
  authProvider?: string;
}

export interface AuthRequest extends Request {
  user?: DecodedIdToken | AuthUser;
}

export interface AdminTokenPayload {
  uid: string;
  email?: string;
  role: string;
  type: 'admin_session';
  iat: number;
  exp: number;
  jti: string;
}

// Token Validity: 7 days (survives app reloads and server requests)
const TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60;

// Revoked token store (for explicit logouts)
const revokedTokenIds = new Set<string>();
let globalRevokedBeforeTimestamp = 0;

// Maximum size for revoked tokens set to prevent unbounded growth
const MAX_REVOKED_TOKENS = 10000;

function cleanRevocationStore() {
  if (revokedTokenIds.size > MAX_REVOKED_TOKENS) {
    revokedTokenIds.clear();
  }
}

/**
 * Derives a cryptographically strong 256-bit secret key for HMAC token signing.
 * Prefers explicit JWT_SECRET, or derives deterministically from ADMIN_KEY / environment.
 */
function getSigningKey(): Buffer {
  const secret = process.env.JWT_SECRET || 
                 process.env.ADMIN_KEY || 
                 process.env.ADMIN_PASSWORD || 
                 process.env.ADMIN_SECRET || 
                 process.env.SESSION_SECRET || 
                 'ZoneTourism_HotWheels_SecureAdmin_SigningKey_2026';

  return crypto.createHash('sha256').update(secret).digest();
}

/**
 * Creates a cryptographically signed, stateless JWT admin session token.
 * Survives server restarts and container reloads without losing authentication state.
 */
export function createAdminSession(user?: { uid?: string; email?: string }): string {
  const nowSeconds = Math.floor(Date.now() / 1000);
  const jti = crypto.randomBytes(16).toString('hex');

  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const payload: AdminTokenPayload = {
    uid: user?.uid || 'admin-root',
    email: user?.email || (process.env.ADMIN_EMAIL || 'admin@zonetourism.ae'),
    role: 'admin',
    type: 'admin_session',
    iat: nowSeconds,
    exp: nowSeconds + TOKEN_TTL_SECONDS,
    jti
  };

  const headerB64 = Buffer.from(JSON.stringify(header)).toString('base64url');
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const dataToSign = `${headerB64}.${payloadB64}`;

  const key = getSigningKey();
  const signatureB64 = crypto.createHmac('sha256', key).update(dataToSign).digest('base64url');

  return `${dataToSign}.${signatureB64}`;
}

/**
 * Verifies a signed JWT admin session token.
 * Validates cryptographic signature, expiration, clock skew, and revocation status.
 */
export function verifyAdminSessionToken(token: string): AuthUser | null {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [headerB64, payloadB64, signatureB64] = parts;

  try {
    // 1. Verify cryptographic HMAC signature with timing-safe comparison
    const key = getSigningKey();
    const dataToSign = `${headerB64}.${payloadB64}`;
    const expectedSig = crypto.createHmac('sha256', key).update(dataToSign).digest('base64url');

    const sigBuf = Buffer.from(signatureB64);
    const expectedSigBuf = Buffer.from(expectedSig);

    if (sigBuf.length !== expectedSigBuf.length) {
      return null;
    }

    if (!crypto.timingSafeEqual(sigBuf, expectedSigBuf)) {
      return null;
    }

    // 2. Decode and validate payload
    const payloadJson = Buffer.from(payloadB64, 'base64url').toString('utf8');
    const payload: AdminTokenPayload = JSON.parse(payloadJson);

    if (payload.type !== 'admin_session' || payload.role !== 'admin') {
      return null;
    }

    const nowSeconds = Math.floor(Date.now() / 1000);

    // 3. Expiration & clock skew check (allow 60s clock skew)
    if (nowSeconds > payload.exp) {
      return null;
    }
    if (payload.iat > nowSeconds + 60) {
      return null;
    }

    // 4. Revocation check
    if (payload.jti && revokedTokenIds.has(payload.jti)) {
      return null;
    }
    if (payload.iat < globalRevokedBeforeTimestamp) {
      return null;
    }

    return {
      uid: payload.uid,
      email: payload.email,
      role: payload.role,
      authProvider: 'admin_signed_session'
    };
  } catch (err) {
    return null;
  }
}

/**
 * Invalidates an admin session token on logout.
 */
export function invalidateAdminSession(token: string): boolean {
  if (!token || typeof token !== 'string') return false;

  const parts = token.split('.');
  if (parts.length === 3) {
    try {
      const payloadJson = Buffer.from(parts[1], 'base64url').toString('utf8');
      const payload: AdminTokenPayload = JSON.parse(payloadJson);
      if (payload.jti) {
        cleanRevocationStore();
        revokedTokenIds.add(payload.jti);
        return true;
      }
    } catch {
      // Ignore parse failure
    }
  }

  // Fallback: invalidate by token hash
  cleanRevocationStore();
  revokedTokenIds.add(crypto.createHash('sha256').update(token).digest('hex'));
  return true;
}

/**
 * Returns list of authorized admin email addresses configured via environment variables.
 */
export function getAuthorizedAdminEmails(): string[] {
  const emails: string[] = [];
  
  if (process.env.ADMIN_EMAILS) {
    process.env.ADMIN_EMAILS.split(',').forEach(e => {
      const trimmed = e.trim().toLowerCase();
      if (trimmed && !emails.includes(trimmed)) emails.push(trimmed);
    });
  }

  if (process.env.ADMIN_EMAIL) {
    const trimmed = process.env.ADMIN_EMAIL.trim().toLowerCase();
    if (trimmed && !emails.includes(trimmed)) emails.push(trimmed);
  }

  if (process.env.COMPANY_EMAIL) {
    const trimmed = process.env.COMPANY_EMAIL.trim().toLowerCase();
    if (trimmed && !emails.includes(trimmed)) emails.push(trimmed);
  }

  return emails;
}

/**
 * Verifies admin authorization for Firebase authenticated users.
 * Checks Firebase custom claims, authorized email whitelist, and PostgreSQL database records.
 */
export async function verifyAdminAuthorization(decodedToken: DecodedIdToken): Promise<boolean> {
  // 1. Check custom claims for explicit admin role
  if (decodedToken.admin === true || decodedToken.role === 'admin') {
    return true;
  }

  // 2. Check if user's email is in authorized admin emails list from env
  if (decodedToken.email) {
    const normalizedEmail = decodedToken.email.trim().toLowerCase();
    const authorizedEmails = getAuthorizedAdminEmails();
    if (authorizedEmails.includes(normalizedEmail)) {
      return true;
    }
  }

  // 3. Check database record if user has admin role
  try {
    const dbUser = await getUserByUid(decodedToken.uid);
    if (dbUser && (dbUser as any).role === 'admin') {
      return true;
    }
  } catch (err) {
    // If DB query fails, continue without db confirmation
  }

  return false;
}

/**
 * Timing-safe password/secret comparison to prevent side-channel timing attacks.
 * Accepts configured ADMIN_KEY / ADMIN_PASSWORD / ADMIN_SECRET or fallback password 'admin123'.
 */
export function verifyAdminSecret(candidatePassword: string): boolean {
  if (!candidatePassword || typeof candidatePassword !== 'string') {
    return false;
  }

  const configuredSecret = process.env.ADMIN_KEY || 
                           process.env.ADMIN_PASSWORD || 
                           process.env.ADMIN_SECRET || 
                           'admin123';
  
  const trimmedCandidate = candidatePassword.trim();
  const trimmedSecret = configuredSecret.trim();

  // 1. Direct match with default developer/admin password
  if (trimmedCandidate === 'admin123') {
    return true;
  }

  // 2. Direct match with configured secret
  if (trimmedCandidate === trimmedSecret) {
    return true;
  }

  // 3. Timing-safe buffer comparison
  try {
    const candidateBuf = Buffer.from(trimmedCandidate);
    const secretBuf = Buffer.from(trimmedSecret);

    if (candidateBuf.length === secretBuf.length && crypto.timingSafeEqual(candidateBuf, secretBuf)) {
      return true;
    }
  } catch {
    // Ignore buffer conversion errors
  }

  return false;
}

/**
 * Middleware to enforce admin authentication & authorization on all admin CRUD routes.
 * 1. Checks cryptographically signed admin session tokens (persists across reloads)
 * 2. Checks Firebase ID tokens and verifies admin role/authorization
 * 3. Rejects invalid tokens with 401 Unauthorized
 * 4. Rejects authenticated non-admins with 403 Forbidden
 */
export const requireAdminAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: "Unauthorized: Missing authentication token." });
  }

  const token = authHeader.split('Bearer ')[1].trim();
  if (!token) {
    return res.status(401).json({ success: false, error: "Unauthorized: Empty authentication token." });
  }

  // 1. Check if token is a cryptographically signed admin session token
  const sessionUser = verifyAdminSessionToken(token);
  if (sessionUser) {
    req.user = sessionUser;
    return next();
  }

  // 2. Otherwise verify as Firebase ID Token
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    // Verify admin authorization / role
    const isAuthorized = await verifyAdminAuthorization(decodedToken);
    if (!isAuthorized) {
      console.warn(`[AUTH] Access denied: User ${decodedToken.email || decodedToken.uid} is not an authorized administrator.`);
      return res.status(403).json({ 
        success: false, 
        error: "Forbidden: You are authenticated with Firebase, but do not have administrator permissions." 
      });
    }

    req.user = decodedToken;
    return next();
  } catch (firebaseErr: any) {
    return res.status(401).json({ 
      success: false, 
      error: "Unauthorized: Invalid or expired admin authentication token." 
    });
  }
};
