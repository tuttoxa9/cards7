export interface Card {
  id: string;
  title: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  reviews?: number;
  category: string;
  rarity?: string;
  inStock: boolean;
  isHot?: boolean;
  description?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  section: 'new-releases' | 'best-sellers' | 'new-in-catalog' | 'catalog' | 'all';
  status: 'active' | 'inactive' | 'draft';
}

export interface Banner {
  id: string;
  title: string;
  description?: string;
  image: string;
  buttonText?: string;
  buttonLink?: string;
  isActive: boolean;
  position: 'hero' | 'secondary';
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SiteSettings {
  id: string;
  siteName: string;
  siteDescription: string;
  logo?: string;
  favicon?: string;
  contactEmail: string;
  phone?: string;
  address?: string;
  socialLinks?: {
    vk?: string;
    telegram?: string;
    instagram?: string;
    youtube?: string;
  };
  updatedAt: Date;
}

export interface AdminUser {
  uid: string;
  email: string;
  name?: string;
  role: 'admin' | 'moderator';
  createdAt: Date;
  lastLoginAt?: Date;
}
