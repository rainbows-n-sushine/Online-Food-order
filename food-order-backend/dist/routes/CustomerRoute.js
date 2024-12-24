"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRoute = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
exports.CustomerRoute = router;
/** **/
/** Sign Up/create customer**/
router.post('/signup', controllers_1.CustomerSignUp);
/**Login **/
router.post('/login', controllers_1.CustomerLogin);
//need to get Authenticated
router.use(middlewares_1.Authenticate);
/** Verify customer Account**/
router.patch('/verify', controllers_1.CustomerVerify);
/** OTP/Requesting OTP**/
router.get('/otp', controllers_1.RequestOTP);
/** Profile **/
router.get('/profile', controllers_1.GetCustomerProfile);
router.patch('/profile', controllers_1.EditCustomerProfile);
//Cart
//Payment
//Order
router.post('/create-order', controllers_1.CreateOrders);
router.get('/orders', controllers_1.GetOrders);
router.get('/order/:id', controllers_1.GetOrder);
//# sourceMappingURL=CustomerRoute.js.map