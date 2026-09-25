import { LocationDto } from './location';

export type CommunityCategory =
  | 'REGIONAL'
  | 'PROFESSIONAL'
  | 'STUDENT'
  | 'HOUSING'
  | 'GENERAL'
  | 'INTEREST'
  | 'ORIGIN'
  | 'JOB';

export type CommunityStatus = 'ACTIVE' | 'ARCHIVED';
export type CommunityMemberRole = 'MEMBER' | 'MODERATOR' | 'LEADER';
export type CommunityMemberStatus = 'ACTIVE' | 'PENDING' | 'BLOCKED';

export interface CommunityDto {
  id: number;
  name: string;
  slug: string;
  description?: string;
  originLocation: LocationDto;
  destinationLocation: LocationDto;
  language?: string;
  category: CommunityCategory;
  coverImage?: string;
  creatorId: number;
  creatorName: string;
  status: CommunityStatus;
  memberCount: number;
  joined: boolean;
  memberRole?: CommunityMemberRole;
  createdAt: string;
}

export interface CommunityMemberDto {
  id: number;
  communityId: number;
  userId: number;
  userName: string;
  userProfession?: string;
  role: CommunityMemberRole;
  status: CommunityMemberStatus;
  joinedAt: string;
}

export interface CreateCommunityRequest {
  name: string;
  description?: string;
  originLocationId: number;
  destinationLocationId: number;
  category: CommunityCategory;
  language?: string;
  coverImage?: string;
}

export interface UpdateCommunityRequest {
  description?: string;
  category?: CommunityCategory;
  language?: string;
  coverImage?: string;
  status?: CommunityStatus;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  empty: boolean;
}
