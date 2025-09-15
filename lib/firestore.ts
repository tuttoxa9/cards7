import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp
} from "firebase/firestore";
import { db } from "./firebase";
import { Card, Banner, Category, SiteSettings } from "./types";

// Коллекции
export const COLLECTIONS = {
  CARDS: "cards",
  BANNERS: "banners",
  CATEGORIES: "categories",
  SITE_SETTINGS: "siteSettings",
  ADMIN_USERS: "adminUsers"
} as const;

// Утилиты для карточек
export class CardService {
  static async getAll(): Promise<Card[]> {
    const snapshot = await getDocs(collection(db, COLLECTIONS.CARDS));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Card[];
  }

  static async getBySection(section: string): Promise<Card[]> {
    const q = query(
      collection(db, COLLECTIONS.CARDS),
      where("section", "==", section),
      where("status", "==", "active"),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Card[];
  }

  static async getById(id: string): Promise<Card | null> {
    const docRef = doc(db, COLLECTIONS.CARDS, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate() || new Date(),
        updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
      } as Card;
    }
    return null;
  }

  static async create(cardData: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, COLLECTIONS.CARDS), {
      ...cardData,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  }

  static async update(id: string, cardData: Partial<Card>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.CARDS, id);
    await updateDoc(docRef, {
      ...cardData,
      updatedAt: Timestamp.now(),
    });
  }

  static async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.CARDS, id);
    await deleteDoc(docRef);
  }
}

// Утилиты для баннеров
export class BannerService {
  static async getAll(): Promise<Banner[]> {
    const snapshot = await getDocs(collection(db, COLLECTIONS.BANNERS));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Banner[];
  }

  static async getActive(): Promise<Banner[]> {
    const q = query(
      collection(db, COLLECTIONS.BANNERS),
      where("isActive", "==", true),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Banner[];
  }

  static async create(bannerData: Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, COLLECTIONS.BANNERS), {
      ...bannerData,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  }

  static async update(id: string, bannerData: Partial<Banner>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.BANNERS, id);
    await updateDoc(docRef, {
      ...bannerData,
      updatedAt: Timestamp.now(),
    });
  }

  static async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.BANNERS, id);
    await deleteDoc(docRef);
  }
}

// Утилиты для категорий
export class CategoryService {
  static async getAll(): Promise<Category[]> {
    const snapshot = await getDocs(collection(db, COLLECTIONS.CATEGORIES));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Category[];
  }

  static async getActive(): Promise<Category[]> {
    const q = query(
      collection(db, COLLECTIONS.CATEGORIES),
      where("isActive", "==", true),
      orderBy("name", "asc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Category[];
  }

  static async create(categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, COLLECTIONS.CATEGORIES), {
      ...categoryData,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  }

  static async update(id: string, categoryData: Partial<Category>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.CATEGORIES, id);
    await updateDoc(docRef, {
      ...categoryData,
      updatedAt: Timestamp.now(),
    });
  }

  static async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.CATEGORIES, id);
    await deleteDoc(docRef);
  }
}

// Утилиты для настроек сайта
export class SiteSettingsService {
  static async get(): Promise<SiteSettings | null> {
    const snapshot = await getDocs(collection(db, COLLECTIONS.SITE_SETTINGS));
    if (snapshot.docs.length > 0) {
      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      } as SiteSettings;
    }
    return null;
  }

  static async createOrUpdate(settingsData: Omit<SiteSettings, 'id' | 'updatedAt'>): Promise<void> {
    const existingSettings = await this.get();

    if (existingSettings) {
      const docRef = doc(db, COLLECTIONS.SITE_SETTINGS, existingSettings.id);
      await updateDoc(docRef, {
        ...settingsData,
        updatedAt: Timestamp.now(),
      });
    } else {
      await addDoc(collection(db, COLLECTIONS.SITE_SETTINGS), {
        ...settingsData,
        updatedAt: Timestamp.now(),
      });
    }
  }
}
