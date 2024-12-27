"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShoppingRoute = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
exports.ShoppingRoute = router;
/**----------------Food Availability------------------**/
router.get('/:pincode', controllers_1.GetFoodAvailability);
/**---------------Top restaurants-------------------**/
router.get('/top-restaurants/:pincode', controllers_1.GetTopRestaurants);
/**-------------Foods available in 30 minutes---------------------**/
router.get('/foods-in-30-min/:pincode', controllers_1.GetFoodsIn30mins);
/**-------------------Search foods---------------**/
router.get('/search/:pincode', controllers_1.SearchFoods);
/**-----------------Find restaurants by ID-----------------**/
router.get('/restaurant/:id', controllers_1.RestaurantsById);
/**-----------------Find offers-----------------**/
router.get('/offers/:pincode', controllers_1.GetAvailableOffers);
router.get('/', (req, res, next) => {
    console.log('this is the shopping router');
});
//# sourceMappingURL=ShoppingRoute.js.map