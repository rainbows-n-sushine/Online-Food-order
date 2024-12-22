"use strict";
//email
//Notifications
//OTP
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnRequestOTP = exports.GenerateOTP = void 0;
const GenerateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiry = new Date();
    expiry.setTime(new Date().getTime() + (30 * 60 * 1000));
    return { otp, expiry };
};
exports.GenerateOTP = GenerateOTP;
const OnRequestOTP = (otp, toPhoneNumber) => {
    const authToken = process.env.AUTH_TOKEN;
    const accountSid = process.env.ACCOUNT_SID;
    const client = require('twilio')(accountSid, authToken);
    console.log('this is the client ', client);
    const response = client.messages.create({
        body: `your otp is ${otp}`,
        from: '+15703654417',
        to: `+251${toPhoneNumber}`
    });
    return response;
};
exports.OnRequestOTP = OnRequestOTP;
//payment notification and emails
//# sourceMappingURL=NotificationUtility.js.map