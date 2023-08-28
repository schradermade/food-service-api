import {Request, Response, NextFunction} from 'express'
import { VendorLoginInputs } from '../dto';
import { validatePassword, vendorExists } from '../utility';

export const VendorLogin = async (req: Request, res: Response, next: NextFunction) => {
    const {email, password} = <VendorLoginInputs>req.body;

    const existingVendor = await vendorExists(undefined, email);

    if (!existingVendor) {
        return res.json({"message": "This vendor does not exist."})
    }

    const validation = await validatePassword(password, existingVendor.password, existingVendor.salt)

    if (validation) {
        return res.json(existingVendor)
    } else {
        return res.json({"message": "Password is not valid!"})
    }
}