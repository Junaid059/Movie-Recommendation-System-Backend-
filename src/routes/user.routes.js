import express from express
import {registerUser,logOut,login} from "../controllers/user.controller.js"
import adminAuth from "../middleware/auth.middleware.js";
import verifyJwt from "../middleware/auth.middleware.js"
import { upload } from '../middleware/multer.middleware.js';
const router = express.Router()

router.route("/register").post(upload.fields([
  {
    name: 'ProfilePic',
    maxCount: 1,
  },
]),registerUser)
router.route("/login").post(login)
router.route("/logout").post(adminAuth,logOut)

export default router