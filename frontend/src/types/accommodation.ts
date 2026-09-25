export type AccommodationType = 'ROOM' | 'PG' | 'FLAT' | 'HOSTEL' | 'FLATMATE';
export type GenderPreference = 'ANY' | 'MALE' | 'FEMALE';
export type FurnishingStatus = 'UNFURNISHED' | 'SEMI_FURNISHED' | 'FULLY_FURNISHED';
export type AccommodationStatus = 'AVAILABLE' | 'OCCUPIED' | 'REMOVED' | 'DRAFT';

export interface AccommodationDto {
  id: number;
  ownerId: number;
  ownerName: string;
  ownerEmail: string;
  title: string;
  description?: string;
  type: AccommodationType;
  rent: number;
  deposit?: number;
  locationId: number;
  city?: string;
  state?: string;
  area?: string;
  availableFrom?: string;
  genderPreference: GenderPreference;
  furnished: FurnishingStatus;
  facilities?: string;
  status: AccommodationStatus;
  imageUrls: string[];
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccommodationRequest {
  title: string;
  description?: string;
  type: AccommodationType;
  rent: number;
  deposit?: number;
  locationId: number;
  availableFrom?: string;
  genderPreference?: GenderPreference;
  furnished?: FurnishingStatus;
  facilities?: string;
  imageUrls?: string[];
}

export interface UpdateAccommodationRequest {
  title?: string;
  description?: string;
  type?: AccommodationType;
  rent?: number;
  deposit?: number;
  locationId?: number;
  availableFrom?: string;
  genderPreference?: GenderPreference;
  furnished?: FurnishingStatus;
  facilities?: string;
  status?: AccommodationStatus;
  imageUrls?: string[];
}

export interface AccommodationFilterParams {
  locationId?: number;
  city?: string;
  type?: AccommodationType;
  minRent?: number;
  maxRent?: number;
  genderPreference?: GenderPreference;
  furnished?: FurnishingStatus;
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: 'ASC' | 'DESC';
}
