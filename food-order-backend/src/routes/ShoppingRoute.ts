import express,{Request,Response,NextFunction} from "express";
import { GetFoodAvailability ,RestaurantsById,GetFoodsIn30mins,GetTopRestaurants,SearchFoods} from "../controllers";

const router=express.Router();

/**----------------Food Availability------------------**/
router.get('/:pincode',GetFoodAvailability)
/**---------------Top restaurants-------------------**/
router.get('/top-restaurants/:pincode',GetTopRestaurants)
/**-------------Foods available in 30 minutes---------------------**/
router.get('/foods-in-30-min/:pincode',GetFoodsIn30mins)
/**-------------------Search foods---------------**/
router.get('/search/:pincode',SearchFoods)
/**-----------------Find restaurants by ID-----------------**/
router.get('/restaurant/:id',RestaurantsById)


router.get('/',(req:Request,res:Response,next:NextFunction)=>{
    console.log('this is the shopping router')

})

export {router as ShoppingRoute}