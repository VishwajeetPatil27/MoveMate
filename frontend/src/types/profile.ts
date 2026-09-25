import { LocationDto } from './location';

export interface ProfileDto {
  id: number;
  userId: number;
  email: string;
  fullName: string;
  profilePhoto?: string;
  bio?: string;
  nativeLocation?: LocationDto;
  currentLocation?: LocationDto;
  profession?: string;
  company?: string;
  college?: string;
  languages?: string;
  interests?: string;
  completionPercentage: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProfileUpdateRequest {
  fullName?: string;
  profilePhoto?: string;
  bio?: string;
  nativeLocationId?: number;
  currentLocationId?: number;
  profession?: string;
  company?: string;
  college?: string;
  languages?: string;
  interests?: string;
}
