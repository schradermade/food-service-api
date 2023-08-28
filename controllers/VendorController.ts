import {Request, Response, NextFunction} from 'express'
import { VendorLoginInputs } from '../dto';
import { generateSignature, validatePassword, vendorExists } from '../utility';

export const VendorLogin = async (req: Request, res: Response, next: NextFunction) => {
    const {email, password} = <VendorLoginInputs>req.body;

    const existingVendor = await vendorExists(undefined, email);

    if (!existingVendor) {
        return res.json({"message": "This vendor does not exist."})
    }

    const passwordValid = await validatePassword(password, existingVendor.password, existingVendor.salt)
    if (passwordValid) {
        const signature = generateSignature({
            _id: existingVendor.id,
            email: existingVendor.email,
            foodTypes: existingVendor.foodType,
            name: existingVendor.name
        })
        return res.json(signature)
    } else {
        return res.json({"message": "Password is not valid!"})
    }
}

export const GetVendorProfile = async (req: Request, res: Response, next: NextFunction) => {

}

export const UpdateVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
    
}

export const UpdateVendorService = async (req: Request, res: Response, next: NextFunction) => {
    
}