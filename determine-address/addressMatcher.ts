import { AddressQuery } from "./addressQuery";
import { Address } from "./address";

export interface AddressMatcher {
    match(q: AddressQuery) : Promise<Address>
}