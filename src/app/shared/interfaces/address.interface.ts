import { MapAddress } from "./map.interface";

export interface Address {
  id: number;
  contact_id: number;
  uf: string;
  city: string;
  street: string;
  map: MapAddress
}