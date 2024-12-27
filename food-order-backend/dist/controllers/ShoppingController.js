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
exports.GetAvailableOffers = exports.RestaurantsById = exports.SearchFoods = exports.GetFoodsIn30mins = exports.GetTopRestaurants = exports.GetFoodAvailability = void 0;
const models_1 = require("../models");
const GetFoodAvailability = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const result = yield models_1.Vendor.find({ pincode: pincode, serviceAvailable: true })
        .sort([["rating", "descending"]])
        .populate('foods');
    if (result.length > 0) {
        res.status(200).send(result);
        return;
    }
    res.status(400).json({ "message": "Data not found" });
    return;
});
exports.GetFoodAvailability = GetFoodAvailability;
const GetTopRestaurants = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const result = yield models_1.Vendor.find({ pincode: pincode, serviceAvailable: false })
        .sort([["rating", "descending"]])
        .limit(1);
    if (result.length > 0) {
        res.status(200).send(result);
        console.log('This is the top 1 restaurant: ', result);
        return;
    }
    res.status(400).json({ "message": "Data not found" });
    return;
});
exports.GetTopRestaurants = GetTopRestaurants;
const GetFoodsIn30mins = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const result = yield models_1.Vendor.find({ pincode: pincode, serviceAvailable: false })
        .populate('foods');
    if (result.length > 0) {
        let foodResults = [];
        result.map((vendor) => {
            const foods = vendor.foods;
            foodResults.push(...foods.filter(food => food.readyTime <= 30));
        });
        res.status(200).send(foodResults);
        return;
    }
    res.status(400).send({ "message": "Data not found" });
    return;
});
exports.GetFoodsIn30mins = GetFoodsIn30mins;
const SearchFoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const result = yield models_1.Vendor.find({ pincode: pincode, serviceAvailable: false })
        .populate('foods');
    if (result.length > 0) {
        let foodResult = [];
        result.map((vendor) => {
            const food = vendor.foods;
            foodResult.push(...food);
        });
        res.status(200).send(foodResult);
        return;
    }
    res.status(400).send({ message: "Data not found" });
});
exports.SearchFoods = SearchFoods;
const RestaurantsById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { pincode } = req.params;
    const { id } = req.params;
    const result = yield models_1.Vendor.findById(id).populate('foods');
    if (result) {
        res.status(200).send(result);
        return;
    }
    res.status(400).send({ message: "Data not found" });
    return;
});
exports.RestaurantsById = RestaurantsById;
/**********************Offer section****************************/
// export const GetOffers=async(req:Request,res:Response,next:NextFunction)=>{
// }
const GetAvailableOffers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    if (pincode) {
        const offers = yield models_1.Offer.find({ pincode, isActive: true }).populate('vendors');
        if (offers !== null) {
            res.status(200).send(offers);
            return;
        }
    }
    res.status(400).send({ message: "Data not found" });
    return;
});
exports.GetAvailableOffers = GetAvailableOffers;
//# sourceMappingURL=ShoppingController.js.map