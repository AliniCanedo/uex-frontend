import { Address } from "./address.interface";

export interface Contact {
  id: number;
  name: string;
  phone: string;
  cpf: string;
  user_id?: number;
  address_attributes: Address;
}
