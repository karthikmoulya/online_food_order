import express from 'express';
import {
  CustomerLogin,
  CustomerSignup,
  CustomerVerify,
  EditCustomerProfile,
  GetCustomerProfile,
  RequestOtp,
} from '../controllers';
import { Authenticate } from '../middlewares/CommonAuth';

const router = express.Router();

/**Singup / create Customer*/
router.post('/signup', CustomerSignup);

/**Login */
router.post('/login', CustomerLogin);

router.use(Authenticate);
/**Verify Customer Account */
router.patch('/verify', CustomerVerify);

/**OTP / Requesting OTP */
router.get('/otp', RequestOtp);

/** Profile */
router.get('/profile', GetCustomerProfile);
router.patch('/profile', EditCustomerProfile);

//Cart
//Order
//Payment

export { router as CustomerRoute };
