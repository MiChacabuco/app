import { Business } from '../../businesses/models/business';

export interface PharmacyShift {
  pharmacy: Business;
  start: string;
  end: string;
}
