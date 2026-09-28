import { db } from './index.ts';
import { cars } from './schema.ts';
import { eq, desc } from 'drizzle-orm';
import { inMemoryStore, loadLocalStore, saveLocalStore } from './localStore.ts';

export interface CarInput {
  id?: string;
  make: string;
  model: string;
  category: string;
  serviceType?: string;
  rentalType?: string;
  seats?: number;
  luggage?: string;
  dailyPriceAED?: number;
  dailyPriceUSD?: number;
  weeklyPriceAED?: number;
  weeklyPriceUSD?: number;
  monthlyPriceAED?: number;
  monthlyPriceUSD?: number;
  yearlyPriceAED?: number;
  yearlyPriceUSD?: number;
  dailyPrice?: number;
  weeklyPrice?: number;
  monthlyPrice?: number;
  yearlyPrice?: number;
  image: string;
  gallery?: string[];
  images?: string[];
  videoUrl?: string;
  video?: string;
  description?: string;
  getQuoteOption?: boolean;
  isMercedesChauffeur?: boolean;
  isActive?: boolean;
}

export async function getActiveCars() {
  try {
    const dbResult = await db.select().from(cars).where(eq(cars.isActive, true)).orderBy(desc(cars.createdAt));
    if (dbResult && dbResult.length > 0) {
      return dbResult;
    }
  } catch (error) {
    // Database connection refused or unconfigured - fallback safely to store
  }

  loadLocalStore();
  return inMemoryStore.cars.filter(c => c.isActive !== false);
}

export async function getAllCarsAdmin() {
  try {
    const dbResult = await db.select().from(cars).orderBy(desc(cars.createdAt));
    if (dbResult && dbResult.length > 0) {
      return dbResult;
    }
  } catch (error) {
    // Fallback to local store
  }

  loadLocalStore();
  return inMemoryStore.cars;
}

export async function getCarById(id: string) {
  try {
    const result = await db.select().from(cars).where(eq(cars.id, id)).limit(1);
    if (result && result[0]) return result[0];
  } catch (error) {
    // Fallback to local store
  }

  loadLocalStore();
  return inMemoryStore.cars.find(c => c.id === id) || null;
}

export async function createCar(data: CarInput) {
  const id = data.id || `car-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
  const dailyAED = data.dailyPriceAED !== undefined ? Number(data.dailyPriceAED) : 0;
  const dailyUSD = data.dailyPriceUSD !== undefined ? Number(data.dailyPriceUSD) : Math.round(dailyAED / 3.67);
  const weeklyAED = data.weeklyPriceAED !== undefined ? Number(data.weeklyPriceAED) : (dailyAED * 6);
  const weeklyUSD = data.weeklyPriceUSD !== undefined ? Number(data.weeklyPriceUSD) : Math.round(weeklyAED / 3.67);
  const monthlyAED = data.monthlyPriceAED !== undefined ? Number(data.monthlyPriceAED) : (dailyAED * 20);
  const monthlyUSD = data.monthlyPriceUSD !== undefined ? Number(data.monthlyPriceUSD) : Math.round(monthlyAED / 3.67);
  const yearlyAED = data.yearlyPriceAED !== undefined ? Number(data.yearlyPriceAED) : (monthlyAED * 10);
  const yearlyUSD = data.yearlyPriceUSD !== undefined ? Number(data.yearlyPriceUSD) : Math.round(yearlyAED / 3.67);

  const carRecord = {
    id,
    make: data.make,
    model: data.model,
    category: data.category,
    serviceType: data.serviceType || 'Both',
    seats: data.seats || 5,
    luggage: data.luggage || '2 Bags',
    dailyPriceAED: dailyAED,
    dailyPriceUSD: dailyUSD,
    weeklyPriceAED: weeklyAED,
    weeklyPriceUSD: weeklyUSD,
    monthlyPriceAED: monthlyAED,
    monthlyPriceUSD: monthlyUSD,
    yearlyPriceAED: yearlyAED,
    yearlyPriceUSD: yearlyUSD,
    image: data.image,
    gallery: data.gallery || data.images || [],
    videoUrl: data.videoUrl || data.video || '',
    description: data.description || '',
    getQuoteOption: Boolean(data.getQuoteOption),
    isMercedesChauffeur: data.isMercedesChauffeur !== undefined 
      ? Boolean(data.isMercedesChauffeur) 
      : String(data.make || '').toLowerCase().includes('mercedes'),
    isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const result = await db.insert(cars).values({
      ...carRecord,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any).returning();
    if (result && result[0]) {
      // Also sync to localStore
      loadLocalStore();
      inMemoryStore.cars.unshift(result[0]);
      saveLocalStore();
      return result[0];
    }
  } catch (error) {
    // Use fallback store
  }

  loadLocalStore();
  inMemoryStore.cars.unshift(carRecord);
  saveLocalStore();
  return carRecord;
}

export async function updateCar(id: string, data: Partial<CarInput>) {
  try {
    const updatePayload: Record<string, any> = { updatedAt: new Date() };
    if (data.make !== undefined) updatePayload.make = data.make;
    if (data.model !== undefined) updatePayload.model = data.model;
    if (data.category !== undefined) updatePayload.category = data.category;
    if (data.serviceType !== undefined) updatePayload.serviceType = data.serviceType;
    else if (data.rentalType !== undefined) updatePayload.serviceType = data.rentalType;

    if (data.seats !== undefined) updatePayload.seats = Number(data.seats);
    if (data.luggage !== undefined) updatePayload.luggage = data.luggage;

    // Daily Pricing
    const dailyAED = data.dailyPriceAED !== undefined ? Number(data.dailyPriceAED) : (data.dailyPrice !== undefined ? Number(data.dailyPrice) : undefined);
    if (dailyAED !== undefined) {
      updatePayload.dailyPriceAED = dailyAED;
      updatePayload.dailyPriceUSD = data.dailyPriceUSD !== undefined ? Number(data.dailyPriceUSD) : Math.round(dailyAED / 3.67);
    } else if (data.dailyPriceUSD !== undefined) {
      updatePayload.dailyPriceUSD = Number(data.dailyPriceUSD);
    }

    // Weekly Pricing
    const weeklyAED = data.weeklyPriceAED !== undefined ? Number(data.weeklyPriceAED) : (data.weeklyPrice !== undefined ? Number(data.weeklyPrice) : undefined);
    if (weeklyAED !== undefined) {
      updatePayload.weeklyPriceAED = weeklyAED;
      updatePayload.weeklyPriceUSD = data.weeklyPriceUSD !== undefined ? Number(data.weeklyPriceUSD) : Math.round(weeklyAED / 3.67);
    } else if (data.weeklyPriceUSD !== undefined) {
      updatePayload.weeklyPriceUSD = Number(data.weeklyPriceUSD);
    }

    // Monthly Pricing
    const monthlyAED = data.monthlyPriceAED !== undefined ? Number(data.monthlyPriceAED) : (data.monthlyPrice !== undefined ? Number(data.monthlyPrice) : undefined);
    if (monthlyAED !== undefined) {
      updatePayload.monthlyPriceAED = monthlyAED;
      updatePayload.monthlyPriceUSD = data.monthlyPriceUSD !== undefined ? Number(data.monthlyPriceUSD) : Math.round(monthlyAED / 3.67);
    } else if (data.monthlyPriceUSD !== undefined) {
      updatePayload.monthlyPriceUSD = Number(data.monthlyPriceUSD);
    }

    // Yearly Pricing
    const yearlyAED = data.yearlyPriceAED !== undefined ? Number(data.yearlyPriceAED) : (data.yearlyPrice !== undefined ? Number(data.yearlyPrice) : undefined);
    if (yearlyAED !== undefined) {
      updatePayload.yearlyPriceAED = yearlyAED;
      updatePayload.yearlyPriceUSD = data.yearlyPriceUSD !== undefined ? Number(data.yearlyPriceUSD) : Math.round(yearlyAED / 3.67);
    } else if (data.yearlyPriceUSD !== undefined) {
      updatePayload.yearlyPriceUSD = Number(data.yearlyPriceUSD);
    }

    if (data.image !== undefined) updatePayload.image = data.image;
    if (data.gallery !== undefined) updatePayload.gallery = data.gallery;
    else if (data.images !== undefined) updatePayload.gallery = data.images;
    if (data.videoUrl !== undefined) updatePayload.videoUrl = data.videoUrl;
    else if (data.video !== undefined) updatePayload.videoUrl = data.video;
    if (data.description !== undefined) updatePayload.description = data.description;
    if (data.getQuoteOption !== undefined) updatePayload.getQuoteOption = Boolean(data.getQuoteOption);
    if (data.isMercedesChauffeur !== undefined) updatePayload.isMercedesChauffeur = Boolean(data.isMercedesChauffeur);
    if (data.isActive !== undefined) updatePayload.isActive = Boolean(data.isActive);

    const result = await db.update(cars)
      .set(updatePayload as any)
      .where(eq(cars.id, id))
      .returning();

    if (result && result[0]) {
      loadLocalStore();
      const idx = inMemoryStore.cars.findIndex(c => c.id === id);
      if (idx !== -1) inMemoryStore.cars[idx] = result[0];
      saveLocalStore();
      return result[0];
    }
  } catch (error) {
    // Fallback update in local store
  }

  loadLocalStore();
  const index = inMemoryStore.cars.findIndex(c => c.id === id);
  if (index === -1) return null;

  const current = inMemoryStore.cars[index];
  const dAED = data.dailyPriceAED !== undefined ? Number(data.dailyPriceAED) : (data.dailyPrice !== undefined ? Number(data.dailyPrice) : current.dailyPriceAED);
  const wAED = data.weeklyPriceAED !== undefined ? Number(data.weeklyPriceAED) : (data.weeklyPrice !== undefined ? Number(data.weeklyPrice) : current.weeklyPriceAED);
  const mAED = data.monthlyPriceAED !== undefined ? Number(data.monthlyPriceAED) : (data.monthlyPrice !== undefined ? Number(data.monthlyPrice) : current.monthlyPriceAED);
  const yAED = data.yearlyPriceAED !== undefined ? Number(data.yearlyPriceAED) : (data.yearlyPrice !== undefined ? Number(data.yearlyPrice) : current.yearlyPriceAED);

  inMemoryStore.cars[index] = {
    ...current,
    ...data,
    dailyPriceAED: dAED,
    dailyPriceUSD: data.dailyPriceUSD !== undefined ? Number(data.dailyPriceUSD) : Math.round(dAED / 3.67),
    weeklyPriceAED: wAED,
    weeklyPriceUSD: data.weeklyPriceUSD !== undefined ? Number(data.weeklyPriceUSD) : Math.round(wAED / 3.67),
    monthlyPriceAED: mAED,
    monthlyPriceUSD: data.monthlyPriceUSD !== undefined ? Number(data.monthlyPriceUSD) : Math.round(mAED / 3.67),
    yearlyPriceAED: yAED,
    yearlyPriceUSD: data.yearlyPriceUSD !== undefined ? Number(data.yearlyPriceUSD) : Math.round(yAED / 3.67),
    updatedAt: new Date().toISOString()
  };
  saveLocalStore();
  return inMemoryStore.cars[index];
}

export async function deleteCar(id: string) {
  try {
    const result = await db.delete(cars).where(eq(cars.id, id)).returning();
    if (result && result[0]) {
      loadLocalStore();
      inMemoryStore.cars = inMemoryStore.cars.filter(c => c.id !== id);
      saveLocalStore();
      return result[0];
    }
  } catch (error) {
    // Fallback delete
  }

  loadLocalStore();
  const existing = inMemoryStore.cars.find(c => c.id === id);
  if (!existing) return null;
  inMemoryStore.cars = inMemoryStore.cars.filter(c => c.id !== id);
  saveLocalStore();
  return existing;
}

export async function toggleCarStatus(id: string, newStatus?: boolean) {
  loadLocalStore();
  const current = inMemoryStore.cars.find(c => c.id === id);
  const targetStatus = newStatus !== undefined ? newStatus : current ? !current.isActive : true;

  try {
    const result = await db.update(cars)
      .set({ isActive: targetStatus, updatedAt: new Date() } as any)
      .where(eq(cars.id, id))
      .returning();
    if (result && result[0]) {
      const idx = inMemoryStore.cars.findIndex(c => c.id === id);
      if (idx !== -1) inMemoryStore.cars[idx] = result[0];
      saveLocalStore();
      return result[0];
    }
  } catch (error) {
    // Fallback
  }

  if (!current) return null;
  current.isActive = targetStatus;
  current.updatedAt = new Date().toISOString();
  saveLocalStore();
  return current;
}
