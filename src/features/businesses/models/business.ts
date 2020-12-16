import { AdminDynamicRestMeta } from '../../../models/response';

interface Phone {
  number: string;
  isWhatsapp: boolean;
}

export type Point = [number, number];

export interface Business {
  id: string;
  name: string;
  summary?: string;
  avatar?: string;
  address?: string;
  point?: Point;
  instagram?: string;
  facebook?: string;
  email?: string;
  website?: string;
  hasDelivery?: boolean;
  phones?: Phone[];
  distance?: number;
}

export interface BusinessesListResponse {
  businesses: Business[];
  meta: AdminDynamicRestMeta;
}
