import { db } from './index.ts';
import { bankAccounts } from './schema.ts';
import { eq } from 'drizzle-orm';
import { inMemoryStore, loadLocalStore, saveLocalStore } from './localStore.ts';

export interface BankAccountRecord {
  id: string;
  companyAccountName: string;
  bankName: string;
  accountNumber: string;
  iban: string;
  swiftCode: string;
  currency: string;
  branchName: string;
  country: string;
  instructions: string;
}

export interface BankDetailsResponse {
  primaryAccount: BankAccountRecord;
  secondaryAccount?: BankAccountRecord;
}

const DEFAULT_PRIMARY: BankAccountRecord = {
  id: 'primary',
  companyAccountName: 'ZONE TOURISM LLC',
  bankName: 'Emirates NBD',
  accountNumber: '1014347702901',
  iban: 'AE790260001014347702901',
  swiftCode: '',
  currency: 'AED',
  branchName: 'Dubai Branch',
  country: 'United Arab Emirates',
  instructions: 'For UAE Visit Visa services and general tourism packages.'
};

const DEFAULT_SECONDARY: BankAccountRecord = {
  id: 'secondary',
  companyAccountName: 'HOTWHEELS CAR RENTALS',
  bankName: 'Habib Bank AG Zurich',
  accountNumber: '02-02-08-020311-105-0573857',
  iban: 'AE030290890210500573857',
  swiftCode: 'HBZUAEADXXX',
  currency: 'AED',
  branchName: 'Sharjah Branch',
  country: 'United Arab Emirates',
  instructions: 'For Car Rental, VIP Chauffeur services, and corporate fleet bookings.'
};

export async function getBankDetailsFromDb(): Promise<BankDetailsResponse> {
  try {
    const rows = await db.select().from(bankAccounts);
    if (rows && rows.length > 0) {
      let primary = rows.find(r => r.id === 'primary');
      let secondary = rows.find(r => r.id === 'secondary');

      return {
        primaryAccount: primary ? {
          id: primary.id,
          companyAccountName: primary.companyAccountName,
          bankName: primary.bankName,
          accountNumber: primary.accountNumber,
          iban: primary.iban,
          swiftCode: primary.swiftCode,
          currency: primary.currency,
          branchName: primary.branchName,
          country: primary.country,
          instructions: primary.instructions
        } : DEFAULT_PRIMARY,
        secondaryAccount: secondary ? {
          id: secondary.id,
          companyAccountName: secondary.companyAccountName,
          bankName: secondary.bankName,
          accountNumber: secondary.accountNumber,
          iban: secondary.iban,
          swiftCode: secondary.swiftCode,
          currency: secondary.currency,
          branchName: secondary.branchName,
          country: secondary.country,
          instructions: secondary.instructions
        } : DEFAULT_SECONDARY
      };
    }
  } catch (error) {
    // Fallback to local store
  }

  loadLocalStore();
  return {
    primaryAccount: inMemoryStore.bankDetails.primaryAccount || DEFAULT_PRIMARY,
    secondaryAccount: inMemoryStore.bankDetails.secondaryAccount || DEFAULT_SECONDARY
  };
}

export async function updateBankDetailsInDb(
  primaryData: Partial<BankAccountRecord>,
  secondaryData?: Partial<BankAccountRecord>
): Promise<BankDetailsResponse> {
  loadLocalStore();

  const mergedPrimary: BankAccountRecord = {
    ...DEFAULT_PRIMARY,
    ...(inMemoryStore.bankDetails.primaryAccount || {}),
    ...primaryData,
    id: 'primary'
  };

  const mergedSecondary: BankAccountRecord = {
    ...DEFAULT_SECONDARY,
    ...(inMemoryStore.bankDetails.secondaryAccount || {}),
    ...(secondaryData || {}),
    id: 'secondary'
  };

  try {
    await db.insert(bankAccounts)
      .values({
        id: 'primary',
        companyAccountName: mergedPrimary.companyAccountName,
        bankName: mergedPrimary.bankName,
        accountNumber: mergedPrimary.accountNumber,
        iban: mergedPrimary.iban,
        swiftCode: mergedPrimary.swiftCode,
        currency: mergedPrimary.currency,
        branchName: mergedPrimary.branchName,
        country: mergedPrimary.country,
        instructions: mergedPrimary.instructions,
        updatedAt: new Date()
      } as any)
      .onConflictDoUpdate({
        target: bankAccounts.id,
        set: {
          companyAccountName: mergedPrimary.companyAccountName,
          bankName: mergedPrimary.bankName,
          accountNumber: mergedPrimary.accountNumber,
          iban: mergedPrimary.iban,
          swiftCode: mergedPrimary.swiftCode,
          currency: mergedPrimary.currency,
          branchName: mergedPrimary.branchName,
          country: mergedPrimary.country,
          instructions: mergedPrimary.instructions,
          updatedAt: new Date()
        } as any
      });

    if (secondaryData) {
      await db.insert(bankAccounts)
        .values({
          id: 'secondary',
          companyAccountName: mergedSecondary.companyAccountName,
          bankName: mergedSecondary.bankName,
          accountNumber: mergedSecondary.accountNumber,
          iban: mergedSecondary.iban,
          swiftCode: mergedSecondary.swiftCode,
          currency: mergedSecondary.currency,
          branchName: mergedSecondary.branchName,
          country: mergedSecondary.country,
          instructions: mergedSecondary.instructions,
          updatedAt: new Date()
        } as any)
        .onConflictDoUpdate({
          target: bankAccounts.id,
          set: {
            companyAccountName: mergedSecondary.companyAccountName,
            bankName: mergedSecondary.bankName,
            accountNumber: mergedSecondary.accountNumber,
            iban: mergedSecondary.iban,
            swiftCode: mergedSecondary.swiftCode,
            currency: mergedSecondary.currency,
            branchName: mergedSecondary.branchName,
            country: mergedSecondary.country,
            instructions: mergedSecondary.instructions,
            updatedAt: new Date()
          } as any
        });
    }
  } catch (error) {
    // Database unconfigured, save to localStore
  }

  inMemoryStore.bankDetails = {
    primaryAccount: mergedPrimary,
    secondaryAccount: mergedSecondary
  };
  saveLocalStore();

  return {
    primaryAccount: mergedPrimary,
    secondaryAccount: mergedSecondary
  };
}
