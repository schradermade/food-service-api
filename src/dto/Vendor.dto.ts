export interface CreateVendorInput {
  name: string;
  ownerName: string;
  foodType: string;
  pincode: string;
  address: string;
  phone: string;
  email: string;
  password: string;
}

export interface EditVendorInputs {
  name: string;
  address: string;
  phone: string;
  foodType: [string];
}

export interface VendorLoginInputs {
  email: string;
  password: string;
}

export interface VenderPayload {
  _id: string;
  email: string;
  name: string;
  foodType: [string];
}
