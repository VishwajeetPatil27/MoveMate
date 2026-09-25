import { LocationDto } from './location';

export type RelocationPurpose = 'JOB' | 'EDUCATION' | 'BUSINESS' | 'FAMILY' | 'OTHER';
export type RelocationStatus = 'ACTIVE' | 'FULFILLED' | 'CANCELLED';

export interface RelocationRequestDto {
  id: number;
  userId: number;
  userName: string;
  originLocation: LocationDto;
  destinationLocation: LocationDto;
  destinationArea?: string;
  purpose: RelocationPurpose;
  profession?: string;
  budget?: number;
  movingDate?: string;
  requirements?: string;
  status: RelocationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRelocationRequest {
  originLocationId: number;
  destinationLocationId: number;
  destinationArea?: string;
  purpose: RelocationPurpose;
  profession?: string;
  budget?: number;
  movingDate?: string;
  requirements?: string;
}

export interface UpdateRelocationRequest {
  originLocationId?: number;
  destinationLocationId?: number;
  destinationArea?: string;
  purpose?: RelocationPurpose;
  profession?: string;
  budget?: number;
  movingDate?: string;
  requirements?: string;
  status?: RelocationStatus;
}
