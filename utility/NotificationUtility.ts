require('dotenv').config();

// Email

// notifications

// OTP
export const generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  let expiry = new Date();
  expiry.setTime(new Date().getTime() + 30 * 60 * 1000);

  return { otp, expiry };
};

export const onRequestOtp = async (otp: number, toPhoneNumber: string) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  const client = require('twilio')(accountSid, authToken);
  const response = await client.messages.create({
    body: `Your OTP is ${otp}`,
    from: '+15037827202',
    to: `+1${toPhoneNumber}`,
  });

  return response;
};
