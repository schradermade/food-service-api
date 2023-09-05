import { VenderPayload } from './Vendor.dto';
import { CustomerPayload } from './Customer.dto';

export type AuthPayload = VenderPayload | CustomerPayload;
