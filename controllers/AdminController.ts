import {Request, Response, NextFunction} from 'express'
import {CreateVendorInput} from '../dto'
import { Vendor } from '../models';
import { generatePassword, generateSalt, vendorExists } from '../utility';



export const CreateVendor = async (req: Request, res: Response, next: NextFunction) => {
    const { name, address, pincode, foodType, email, password, ownerName, phone} = <CreateVendorInput>req.body;

    const existingVendor = await vendorExists(undefined, email)

    if (existingVendor !== null) {
        return res.json({"message": "A vendor with that email already exists."})
    }

    // generate salt
    const salt = await generateSalt()
    // encrypt the password using the salt
    const userPassword = await generatePassword(password, salt);

    const createdVendor = await Vendor.create({
        name: name,
        address: address,
        pincode: pincode,
        foodType: foodType,
        email: email,
        salt: salt,
        password: userPassword,
        ownerName: ownerName,
        phone: phone,
        rating: 0,
        serviceAvailable: false,
        coverImages: [],
    })
    return res.json(createdVendor)
}

export const GetVendors = async (req: Request, res: Response, next: NextFunction) => {
    const vendors = await Vendor.find()

    if(vendors !== null) {
        return res.json(vendors)
    }

    return res.json({"message": "No vendors data available"})
}

export const GetVendorById = async (req: Request, res: Response, next: NextFunction) => {
    const vendorId = req.params.id;

    const vendor = await vendorExists(vendorId)
    if (vendor === null) {
        return res.json({"message": `Vendor id ${vendorId} not found`});
    }

    return res.json(vendor)
}