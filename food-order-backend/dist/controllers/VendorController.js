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
exports.GetFoods = exports.AddFood = exports.UpdateVendorCoverImage = exports.UpdateVendorService = exports.UpdateVendorProfile = exports.GetVendorProfile = exports.VendorLogin = void 0;
const _1 = require(".");
const utility_1 = require("../utility");
const models_1 = require("../models");
const VendorLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const existingVendor = yield (0, _1.findVendor)("", email);
    if (existingVendor !== null) {
        //validate and give acces
        const validation = yield (0, utility_1.ValidatePassword)(password, existingVendor.password, existingVendor.salt);
        if (validation) {
            const signature = yield (0, utility_1.GenerateSignature)({
                _id: existingVendor.id,
                foodTypes: existingVendor.foodTypes,
                name: existingVendor.name,
                email: existingVendor.email,
            });
            res.send({ success: true, message: "Login successful", vendor: existingVendor, signature: signature });
            return;
        }
        else {
            res.send({ success: false, message: "Password is invalid" });
            return;
        }
    }
    res.send({ message: "incorrect credentials" });
    return;
});
exports.VendorLogin = VendorLogin;
const GetVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingVendor = yield (0, _1.findVendor)(user._id);
        if (existingVendor !== null) {
            res.send(existingVendor);
            return;
        }
        res.send({ message: "Vendor information not found" });
        return;
    }
    else {
        res.send({ message: "User is not authorized" });
        return;
    }
});
exports.GetVendorProfile = GetVendorProfile;
const UpdateVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { name, foodTypes, address, phone } = req.body;
        if (user) {
            const existingVendor = yield (0, _1.findVendor)(user._id);
            if (existingVendor !== null) {
                existingVendor.name = name;
                existingVendor.foodTypes = foodTypes;
                existingVendor.address = address;
                existingVendor.phone = phone;
                const savedResults = yield existingVendor.save();
                res.send(savedResults);
                return;
            }
            else {
                res.send({ message: "this user doesnt exist", success: false });
                return;
            }
        }
        else {
            console.log('U need to first sign in!');
            return;
        }
    }
    catch (error) {
        if (error) {
            console.log("Error: ", error);
        }
    }
});
exports.UpdateVendorProfile = UpdateVendorProfile;
const UpdateVendorService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (user) {
            const existingVendor = yield (0, _1.findVendor)(user._id);
            if (existingVendor !== null) {
                existingVendor.serviceAvailable = !existingVendor.serviceAvailable;
                const savedResults = yield existingVendor.save();
                res.send(savedResults);
                return;
            }
            else {
                res.send({ message: "this user doesnt exist", success: false });
                return;
            }
        }
        else {
            console.log('U need to first sign in!');
            return;
        }
    }
    catch (error) {
        if (error) {
            console.log("Error: ", error);
        }
    }
});
exports.UpdateVendorService = UpdateVendorService;
const UpdateVendorCoverImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    console.log('this is the user', user);
    if (user) {
        const existingVendor = yield (0, _1.findVendor)(user._id);
        if (existingVendor !== null) {
            const files = req.files;
            const images = files.map(file => {
                return file.originalname;
            });
            existingVendor.coverImages.push(...images);
            const result = yield existingVendor.save();
            res.json(result);
            return;
        }
        res.json('the vendor information doesnt exist');
        return;
    }
    else {
        res.json({ message: "User is not authorized" });
        return;
    }
});
exports.UpdateVendorCoverImage = UpdateVendorCoverImage;
const AddFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const files = req.files;
        console.log("this is files", files);
        const images = files.map((file) => {
            return file.filename;
            console.log("this is th efile: ", file);
        });
        console.log("this is images", images);
        const { name, description, category, foodType, readyTime, price } = req.body;
        const vendor = yield (0, _1.findVendor)(user._id);
        if (vendor !== null) {
            const createdFood = yield models_1.Food.create({
                vendorId: vendor._id,
                name: name,
                description: description,
                category: category,
                foodType: foodType,
                readyTime: readyTime,
                price: price,
                images: images,
                rating: 0
            });
            vendor.foods.push(createdFood);
            const result = yield vendor.save();
            res.send({ message: "successfully added a new food", createdFood: result });
            return;
        }
        res.send({ message: "Failed at creating a new food. Vendor information not available." });
        return;
    }
});
exports.AddFood = AddFood;
const GetFoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const foods = yield models_1.Food.find({ vendorId: user._id });
        console.log('this is foods', foods);
        if (foods !== null) {
            res.send({ foods: foods });
            return;
        }
        res.send({ message: "no food under that vendor" });
        return;
    }
});
exports.GetFoods = GetFoods;
//# sourceMappingURL=VendorController.js.map