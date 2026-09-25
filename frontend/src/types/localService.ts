export type ServiceCategory =
  | 'HEALTHCARE'
  | 'FOOD'
  | 'TRANSPORT'
  | 'GROCERY'
  | 'FINANCIAL'
  | 'ESSENTIAL_SERVICES'
  | 'EDUCATION'
  | 'PUBLIC_SERVICES'
  | 'FITNESS'
  | 'EMERGENCY'
  | 'OTHER';

export type ServiceStatus = 'PUBLISHED' | 'PAUSED' | 'REMOVED';

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  empty: boolean;
}

export interface RecommendationDto {
  id: number;
  creatorId: number;
  creatorName: string;
  creatorEmail: string;
  locationId: number;
  city: string;
  state: string;
  area: string;
  title: string;
  description?: string;
  category: ServiceCategory;
  subcategory?: string;
  address?: string;
  phone?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  distanceFromUserKm?: number;
  openingHours?: string;
  rating?: number;
  status: ServiceStatus;
  isSaved: boolean;
  createdAt: string;
}

export interface CreateRecommendationRequest {
  title: string;
  description?: string;
  category: ServiceCategory;
  subcategory?: string;
  locationId: number;
  address?: string;
  phone?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  openingHours?: string;
  rating?: number;
}

export interface UpdateRecommendationRequest {
  title?: string;
  description?: string;
  category?: ServiceCategory;
  subcategory?: string;
  locationId?: number;
  address?: string;
  phone?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  openingHours?: string;
  rating?: number;
  status?: ServiceStatus;
}
