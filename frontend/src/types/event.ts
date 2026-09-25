export type EventStatus = 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
export type RsvpStatus = 'ATTENDING' | 'INTERESTED' | 'DECLINED';

export interface EventDto {
  id: number;
  communityId: number;
  communityName: string;
  communitySlug: string;

  creatorId: number;
  creatorName: string;

  title: string;
  description?: string;
  location: string;
  eventDate: string;
  capacity?: number;
  attendeeCount: number;

  status: EventStatus;
  attending: boolean;
  userRsvpStatus?: RsvpStatus;

  createdAt: string;
}

export interface CreateEventRequest {
  communityId: number;
  title: string;
  description?: string;
  location: string;
  eventDate: string;
  capacity?: number;
}

export interface UpdateEventRequest {
  title?: string;
  description?: string;
  location?: string;
  eventDate?: string;
  capacity?: number;
  status?: EventStatus;
}
