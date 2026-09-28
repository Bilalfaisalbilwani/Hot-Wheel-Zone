import { db } from './index.ts';
import { enquiries } from './schema.ts';
import { eq, desc } from 'drizzle-orm';
import { inMemoryStore, loadLocalStore, saveLocalStore } from './localStore.ts';

export interface EnquiryInput {
  id?: string;
  referenceId?: string;
  enquiryType: string; // 'visa' | 'car-rental' | 'chauffeur' | 'contact'
  name: string;
  nationality?: string;
  isUaeResident?: string;
  destination?: string;
  travelDate?: string;
  whatsappNumber: string;
  pickupLocation?: string;
  pickupDate?: string;
  returnDate?: string;
  serviceType?: string;
  vehicleType?: string;
  status?: string; // 'New' | 'Contacted' | 'In Progress' | 'Completed' | 'Cancelled'
  notes?: string;
}

export interface EnquiryUpdateInput {
  status?: string;
  notes?: string;
}

export async function createEnquiryInDb(data: EnquiryInput) {
  const id = data.id || `enq-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const referenceId = data.referenceId || (
    data.enquiryType === 'visa' 
      ? `HWZ-VE-${Math.floor(10000 + Math.random() * 90000)}`
      : data.enquiryType === 'car-rental'
      ? `HWZ-CRE-${Math.floor(10000 + Math.random() * 90000)}`
      : `HWZ-ENQ-${Math.floor(10000 + Math.random() * 90000)}`
  );

  const enquiryRecord = {
    id,
    referenceId,
    enquiryType: data.enquiryType,
    name: data.name || '',
    nationality: data.nationality || '',
    isUaeResident: data.isUaeResident || '',
    destination: data.destination || '',
    travelDate: data.travelDate || '',
    whatsappNumber: data.whatsappNumber || '',
    pickupLocation: data.pickupLocation || '',
    pickupDate: data.pickupDate || '',
    returnDate: data.returnDate || '',
    serviceType: data.serviceType || '',
    vehicleType: data.vehicleType || '',
    status: data.status || 'New',
    notes: data.notes || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  try {
    const result = await db.insert(enquiries).values({
      ...enquiryRecord,
      createdAt: new Date(),
      updatedAt: new Date()
    } as any).returning();

    if (result && result[0]) {
      loadLocalStore();
      inMemoryStore.enquiries.unshift(result[0]);
      saveLocalStore();
      return result[0];
    }
  } catch (error) {
    // Database connection refused or unconfigured - fallback safely to store
  }

  loadLocalStore();
  inMemoryStore.enquiries.unshift(enquiryRecord);
  saveLocalStore();
  return enquiryRecord;
}

export async function getAllEnquiriesFromDb() {
  try {
    const rows = await db.select().from(enquiries).orderBy(desc(enquiries.createdAt));
    if (rows && rows.length > 0) {
      return rows;
    }
  } catch (error) {
    // Fallback to local store
  }

  loadLocalStore();
  return inMemoryStore.enquiries;
}

export async function getEnquiryByIdFromDb(id: string) {
  try {
    const result = await db.select().from(enquiries).where(eq(enquiries.id, id)).limit(1);
    if (result && result[0]) return result[0];
  } catch (error) {
    // Fallback to local store
  }

  loadLocalStore();
  return inMemoryStore.enquiries.find(e => e.id === id) || null;
}

export async function updateEnquiryInDb(id: string, updates: EnquiryUpdateInput) {
  try {
    const updateData: Record<string, any> = {
      updatedAt: new Date()
    };

    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.notes !== undefined) updateData.notes = updates.notes;

    const result = await db.update(enquiries)
      .set(updateData as any)
      .where(eq(enquiries.id, id))
      .returning();

    if (result && result[0]) {
      loadLocalStore();
      const idx = inMemoryStore.enquiries.findIndex(e => e.id === id);
      if (idx !== -1) inMemoryStore.enquiries[idx] = result[0];
      saveLocalStore();
      return result[0];
    }
  } catch (error) {
    // Fallback
  }

  loadLocalStore();
  const index = inMemoryStore.enquiries.findIndex(e => e.id === id);
  if (index === -1) {
    throw new Error(`Enquiry with id ${id} not found.`);
  }

  inMemoryStore.enquiries[index] = {
    ...inMemoryStore.enquiries[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  saveLocalStore();
  return inMemoryStore.enquiries[index];
}

export async function deleteEnquiryFromDb(id: string) {
  try {
    const result = await db.delete(enquiries).where(eq(enquiries.id, id)).returning();
    if (result && result[0]) {
      loadLocalStore();
      inMemoryStore.enquiries = inMemoryStore.enquiries.filter(e => e.id !== id);
      saveLocalStore();
      return result[0];
    }
  } catch (error) {
    // Fallback
  }

  loadLocalStore();
  const existing = inMemoryStore.enquiries.find(e => e.id === id);
  if (!existing) {
    throw new Error(`Enquiry with id ${id} not found.`);
  }
  inMemoryStore.enquiries = inMemoryStore.enquiries.filter(e => e.id !== id);
  saveLocalStore();
  return existing;
}
