import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { VenderPayload } from '../dto';
require('dotenv').config()

export const generateSalt = async () => {
    return await bcrypt.genSalt()
}

export const generatePassword = async (password: string, salt: string) => {
    return await bcrypt.hash(password, salt);
}

export const validatePassword = async (enteredPassword: string, savedPassword: string, salt: string) => {
    return await generatePassword(enteredPassword, salt) === savedPassword
}

export const generateSignature = (payload: VenderPayload) => {
    return jwt.sign(payload, process.env.APP_SECRET || '', {
        expiresIn: '1d'
    })

}