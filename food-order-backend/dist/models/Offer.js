"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Offer = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const OfferSchema = new mongoose_1.Schema({
    offerType: { type: String, required: true },
    vendors: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: "vendor" }
    ],
    title: { type: String, require: true },
    description: String,
    minValue: { type: Number, require: true },
    offerAmount: { type: Number, require: true },
    startValidity: Date,
    endValidity: Date,
    promocode: { type: String, required: true },
    promotype: { type: String, required: true },
    bank: [
        { type: String }
    ],
    bins: [
        { type: Number }
    ],
    pincode: { type: String, required: true },
    isActive: Boolean
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.__v;
        },
        timestamps: true
    }
});
const Offer = mongoose_1.default.model("offer", OfferSchema);
exports.Offer = Offer;
//# sourceMappingURL=Offer.js.map