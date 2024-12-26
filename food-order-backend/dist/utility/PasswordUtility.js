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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateSignature = exports.GenerateSignature = exports.ValidatePassword = exports.GeneratePassword = exports.GenerateSalt = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const GenerateSalt = () => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield bcrypt_1.default.genSalt();
    return salt;
});
exports.GenerateSalt = GenerateSalt;
const GeneratePassword = (password, salt) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcrypt_1.default.hash(password, salt);
    return hashedPassword;
});
exports.GeneratePassword = GeneratePassword;
const ValidatePassword = (enteredPassword, savedPassword, salt) => __awaiter(void 0, void 0, void 0, function* () {
    const passwordEntered = yield (0, exports.GeneratePassword)(enteredPassword, salt);
    return passwordEntered === savedPassword;
});
exports.ValidatePassword = ValidatePassword;
const GenerateSignature = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const signature = jsonwebtoken_1.default.sign(payload, config_1.APP_SECRET, { expiresIn: "10d" });
    return signature;
});
exports.GenerateSignature = GenerateSignature;
const ValidateSignature = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const signature = req.get('Authorization');
    console.log('this is signature: ', signature);
    if (signature) {
        const token = signature.split(" ")[1];
        const payload = yield jsonwebtoken_1.default.verify(token, config_1.APP_SECRET);
        req.user = payload;
        return true;
    }
    return false;
});
exports.ValidateSignature = ValidateSignature;
//# sourceMappingURL=PasswordUtility.js.map