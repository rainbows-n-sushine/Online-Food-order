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
exports.GetTransaction = exports.GetTransactions = exports.GetVendorByID = exports.GetVendors = exports.CreateVendor = exports.findVendor = void 0;
const models_1 = require("../models");
const utility_1 = require("../utility");
const Transaction_1 = require("../models/Transaction");
const findVendor = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (email) {
        const vendor = yield models_1.Vendor.findOne({ email: email });
        return vendor;
    }
    else {
        const vendor = yield models_1.Vendor.findById(id);
        return vendor;
    }
});
exports.findVendor = findVendor;
const CreateVendor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, ownerName, email, foodTypes, pincode, address, phone, password } = req.body;
        const existingVendor = yield (0, exports.findVendor)('', email);
        if (existingVendor !== null) {
            res.json({ "message": "there is already a vendor under the same email" });
            return;
        }
        //generate salt
        const salt = yield (0, utility_1.GenerateSalt)();
        const hashedPassword = yield (0, utility_1.GeneratePassword)(password, salt);
        const newVendor = yield models_1.Vendor.create({
            name: name,
            ownerName: ownerName,
            email: email,
            foodTypes: foodTypes,
            pincode: pincode,
            address: address,
            phone: phone,
            password: hashedPassword,
            rating: 0,
            serviceAvailable: false,
            salt: salt,
            coverImages: [],
            foods: []
        });
        res.send(newVendor);
        return;
    }
    catch (error) {
        if (error) {
            res.send({ success: false, message: error });
        }
    }
});
exports.CreateVendor = CreateVendor;
const GetVendors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendors = yield models_1.Vendor.find();
        if (vendors !== null) {
            res.send(vendors);
            return;
        }
        res.send({ message: "there is no vendor data available" });
    }
    catch (error) {
        if (error) {
            console.log("error: ", error);
        }
    }
});
exports.GetVendors = GetVendors;
const GetVendorByID = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendorId = req.params.id;
        const vendor = yield (0, exports.findVendor)(vendorId);
        if (vendor !== null) {
            res.send(vendor);
            return;
        }
        res.send({ message: "Vendor data is not available" });
        return;
    }
    catch (error) {
        if (error) {
            console.log("error: ", error);
        }
    }
});
exports.GetVendorByID = GetVendorByID;
const GetTransactions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield Transaction_1.Transaction.find();
    if (transactions) {
        res.status(200).send(transactions);
        return;
    }
    res.status(400).json({ message: "Transactions data is not available" });
    return;
});
exports.GetTransactions = GetTransactions;
const GetTransaction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const txnId = req.params.id;
    if (txnId) {
        const transaction = yield Transaction_1.Transaction.findById(txnId);
        if (transaction) {
            res.status(200).send(transaction);
            return;
        }
    }
    res.status(400).json({ message: "Transaction data is not available" });
    return;
});
exports.GetTransaction = GetTransaction;
//# sourceMappingURL=AdminController.js.map