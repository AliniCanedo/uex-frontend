import { Address } from "./address.interface";

export interface Contact {
  id: number;
  name: string;
  phone: string;
  cpf: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  address: Address;
}
