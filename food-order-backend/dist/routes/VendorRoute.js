"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorRoute = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
exports.VendorRoute = router;
const imageStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, '../images'));
    },
    filename: (req, file, cb) => {
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        const newFilename = `${timestamp}_${file.originalname}`;
        cb(null, newFilename);
        // cb(null,new Date().toISOString()+"_"+ file.originalname)
    }
});
const images = (0, multer_1.default)({ storage: imageStorage }).array("images", 10);
router.post('/login', controllers_1.VendorLogin);
router.use(middlewares_1.Authenticate);
router.get('/profile', controllers_1.GetVendorProfile);
router.patch('/profile', controllers_1.UpdateVendorProfile);
router.patch('/service', controllers_1.UpdateVendorService);
router.patch('/coverimage', images, controllers_1.UpdateVendorCoverImage);
router.post('/food', images, controllers_1.AddFood);
router.get("/foods", controllers_1.GetFoods);
router.get('/', (req, res, next) => {
    res.json('Welcome to the vendor route');
});
//# sourceMappingURL=VendorRoute.js.map