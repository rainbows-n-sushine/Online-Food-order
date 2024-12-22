"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditCustomerProfile = exports.GetCustomerProfile = exports.RequestOTP = exports.CustomerVerify = exports.CustomerLogin = exports.CustomerSignUp = void 0;
const dto_1 = require("../dto");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const utility_1 = require("../utility");
const models_1 = require("../models");
const CustomerSignUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customerInputs = (0, class_transformer_1.plainToClass)(dto_1.CreateCustomerInputs, req.body);
    const inputErrors = yield (0, class_validator_1.validate)(customerInputs, { validationError: { target: true } });
    if (inputErrors.length > 0) {
        res.json(inputErrors);
        return;
    }
    const { password, email, phone } = customerInputs;
    const salt = yield (0, utility_1.GenerateSalt)();
    const userPassword = yield (0, utility_1.GeneratePassword)(password, salt);
    const { otp, expiry } = (0, utility_1.GenerateOTP)();
    const existingCustomer = yield models_1.Customer.findOne({ email: email });
    if (existingCustomer !== null) {
        res.status(400).json({ message: "customer with similar email exists" });
        return;
    }
    const NewCustomer = yield models_1.Customer.create({
        email: email,
        password: userPassword,
        firstName: "",
        salt: salt,
        lastName: '',
        address: "",
        phone: phone,
        verified: false,
        otp: otp,
        otp_expiry: expiry,
        lat: 0,
        lng: 0
    });
    if (NewCustomer) {
        console.log(NewCustomer);
        //send the OTP to customer
        yield (0, utility_1.OnRequestOTP)(otp, phone);
        //generate Signature
        const signature = yield (0, utility_1.GenerateSignature)({
            _id: NewCustomer._id,
            email: NewCustomer.email,
            verified: NewCustomer.verified
        });
        res.status(200).json({ signature: signature, verified: NewCustomer.verified, email: NewCustomer.email });
        //send the result to client
        return;
    }
    res.status(200).json({ message: "Invalid data" });
});
exports.CustomerSignUp = CustomerSignUp;
const CustomerLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const loginInputs = (0, class_transformer_1.plainToClass)(dto_1.UserLoginInputs, req.body);
    const loginErrors = yield (0, class_validator_1.validate)(loginInputs, { validationError: { target: false } });
    if (loginErrors.length > 0) {
        res.status(400).send(loginErrors);
        return;
    }
    const { password, email } = loginInputs;
    const customer = yield models_1.Customer.findOne({ email: email });
    if (customer) {
        const validation = yield (0, utility_1.ValidatePassword)(password, customer.password, customer.salt);
        if (validation) {
            // const {otp,expiry}= await GenerateOTP()
            // customer.otp=otp
            // const updatedCustomer=await customer.save()
            // await OnRequestOTP(otp,updatedCustomer.phone)
            const signature = yield (0, utility_1.GenerateSignature)({
                _id: customer._id,
                email: customer.email,
                verified: customer.verified
            });
            res.status(200).json({
                signature: signature,
                verfied: customer.verified,
                email: customer.email
            });
            return;
        }
        res.status(400).json({ message: "Login validation failed" });
    }
});
exports.CustomerLogin = CustomerLogin;
const CustomerVerify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = req.body;
    const customer = req.user;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id);
        if (profile !== null) {
            if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
                profile.verified = true;
                const updatedCustomer = yield profile.save();
                const signature = yield (0, utility_1.GenerateSignature)({
                    verified: updatedCustomer.verified,
                    _id: updatedCustomer._id,
                    email: updatedCustomer.email
                });
                res.status(201).json({ verified: updatedCustomer.verified, signature: signature, email: updatedCustomer.email });
                return;
            }
        }
        res.status(404).json({ message: "Login error" });
        return;
    }
});
exports.CustomerVerify = CustomerVerify;
const RequestOTP = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id);
        if (profile) {
            const { otp, expiry } = (0, utility_1.GenerateOTP)();
            profile.otp = otp;
            profile.otp_expiry = expiry;
            yield profile.save();
            (0, utility_1.OnRequestOTP)(profile.otp, profile.phone);
            res.status(201).json({ message: "the otp is sent to your registered number" });
            return;
        }
    }
    res.status(400).json({ message: "Error in sending otp" });
});
exports.RequestOTP = RequestOTP;
const GetCustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const customer = yield models_1.Customer.findById(user._id);
        if (customer) {
            res.status(200).send(customer);
            return;
        }
    }
    res.status(400).send("Error fetching profile");
    return;
});
exports.GetCustomerProfile = GetCustomerProfile;
const EditCustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    const profileInputs = (0, class_transformer_1.plainToClass)(dto_1.EditCustomerProfileInputs, req.body);
    const profileErrors = yield (0, class_validator_1.validate)(profileInputs, { validationError: { target: false } });
    if (profileErrors.length > 0) {
        res.status(400).send(profileErrors);
        return;
    }
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id);
        if (profile) {
            const { firstName, lastName, address } = profileInputs;
            profile.firstName = firstName;
            profile.lastName = lastName;
            profile.address = address;
            const updatedProfile = yield profile.save();
            res.status(200).send(updatedProfile);
        }
    }
    res.status(400).json({ message: "Error in editing teh profile" });
});
exports.EditCustomerProfile = EditCustomerProfile;
//# sourceMappingURL=CustomerController.js.map