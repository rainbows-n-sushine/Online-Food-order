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
exports.DeleteCart = exports.GetCart = exports.AddToCart = exports.GetOrder = exports.GetOrders = exports.CreateOrders = exports.EditCustomerProfile = exports.GetCustomerProfile = exports.RequestOTP = exports.CustomerVerify = exports.CustomerLogin = exports.CustomerSignUp = void 0;
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
    console.log('We are in here');
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
        return;
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
//*****************Order section *******************/
const CreateOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //Grab current login customer
    const customer = req.user;
    if (customer) {
        const orderId = `${Math.floor(Math.random() * 89999 + 1000)}`;
        const cart = req.body;
        console.log('this is above the customers id');
        const profile = yield models_1.Customer.findById(customer._id);
        console.log('this is below the customers id');
        const foods = yield models_1.Food.find().where('_id').in(cart.map(item => item._id)).exec();
        let cartItems = Array();
        let netAmount = 0.0;
        foods.map(food => {
            cart.map(({ _id, unit }) => {
                if (food._id == _id)
                    netAmount += (food.price * unit);
                cartItems.push({ food, unit });
            });
        });
        if (cartItems) {
            const currentOrder = yield models_1.Order.create({
                orderId: orderId,
                items: cartItems,
                totalAmount: netAmount,
                orderDate: new Date(),
                paidThrough: "COD",
                paymentResponse: "",
                orderStatus: "waiting"
            });
            if (currentOrder) {
                profile.orders.push(currentOrder);
                yield profile.save();
                res.status(200).send(currentOrder);
                return;
            }
        }
    }
    res.status(400).json({
        message: "Error creating an order"
    });
});
exports.CreateOrders = CreateOrders;
const GetOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id).populate('orders');
        if (profile) {
            res.status(200).send(profile.orders);
            return;
        }
    }
    res.status(400).json({ message: "Error fetching orders" });
    return;
});
exports.GetOrders = GetOrders;
const GetOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    if (orderId) {
        const order = yield models_1.Order.findById(orderId).populate('items.food');
        console.log("this is order: ", order);
        if (models_1.Order) {
            res.status(200).send(order);
            return;
        }
        res.status(400).json({ message: "Error in fetching the order" });
        return;
    }
});
exports.GetOrder = GetOrder;
//*****************************   Cart section   *****************************/
const AddToCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const { _id, unit } = req.body;
        const food = yield models_1.Food.findById(_id);
        let cartItems = Array();
        if (food) {
            const profile = yield models_1.Customer.findById(customer._id).populate('cart.food');
            if (profile != null) {
                cartItems = profile.cart;
                if (cartItems.length > 0) {
                    const existingFood = cartItems.filter(item => item.food._id.toString() === _id);
                    if (existingFood.length > 0) {
                        const index = cartItems.indexOf(existingFood[0]);
                        if (unit > 0) {
                            cartItems[index] = { food, unit };
                        }
                        else {
                            cartItems.splice(index, 1);
                        }
                    }
                    else {
                        cartItems.push({ food, unit });
                    }
                }
                else {
                    cartItems.push({ food, unit });
                }
                if (cartItems) {
                    profile.cart = cartItems;
                    const cartResult = yield profile.save();
                    res.status(200).send(cartResult.cart);
                    return;
                }
            }
        }
    }
    res.status(400).send({ message: 'error adding to cart' });
});
exports.AddToCart = AddToCart;
const GetCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id).populate('cart.food');
        if (profile !== null) {
            const cartResult = profile.cart;
            res.status(200).send(cartResult);
            return;
        }
    }
    res.status(400).json({ message: "Cart is empty" });
    return;
});
exports.GetCart = GetCart;
const DeleteCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id).populate('cart.food');
        if (profile !== null) {
            profile.cart = [];
            const cartResult = yield profile.save();
            res.status(200).send(cartResult);
            return;
        }
    }
    res.status(400).json({ message: "Cart is already empty" });
    return;
});
exports.DeleteCart = DeleteCart;
//# sourceMappingURL=CustomerController.js.map