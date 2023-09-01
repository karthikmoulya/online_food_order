import express from 'express';
import {
  GetFoodAvailability,
  GetFoodIn30Min,
  GetTopRestaurants,
  RestaurantById,
  SearchFoods,
} from '../controllers';

const router = express.Router();

/**Food Availablity */
router.get('/:pincode', GetFoodAvailability);

/**Top Restaurants */
router.get('/top-restaurants/:pincode', GetTopRestaurants);

/**Foods Available in 30 Minutes */
router.get('/foods-in-30-min/:pincode', GetFoodIn30Min);

/**Search Foods */
router.get('/search/:pincode', SearchFoods);

/**Find Restaurant By ID */
router.get('/resturant/:id', RestaurantById);

export { router as ShoppingRoute };
