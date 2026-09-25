export interface LocationDto {
  id: number;
  country: string;
  state: string;
  city: string;
  area?: string;
  latitude?: number;
  longitude?: number;
  displayName: string;
}
