import { MapAddress } from "./map.interface";

export interface Address {
  id?: number;
  contact_id: number;
  cep: string;
  uf: string;
  city: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  map_attributes: MapAddress
}