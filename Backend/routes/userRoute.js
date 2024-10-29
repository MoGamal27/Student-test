import express from 'express';
import { registerUser , loginUser , bookAppointment} from '../controllers/userControllers.js';
import authAdmin from '../middlewares/authAdmin.js';



const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/book-appointment' , bookAppointment)


export default userRouter

