import { Vendor } from "../models";

export const vendorExists = async (id: string | undefined, email?: string) => {
    return email ? await Vendor.findOne({email:email}) : Vendor.findById(id)
}