import express from 'express';
import verifyjwt from '../middleware/auth.middleware.js';
import {
  registerUser,
  logOut,
  login,
  updateUser,
  deleteUser,
  changePass,
  updateProfilePic,
} from '../controllers/user.controller.js';
import { upload } from '../middleware/multer.middleware.js';
const router = express.Router();

router.route('/register').post(
  upload.fields([
    {
      name: 'ProfilePic',
      maxCount: 1,
    },
  ]),
  registerUser
);
router.route('/login').post(login);
router.route('/logout').post(logOut);
router.route('/update/user:/id').put(updateUser);
router.route('/delete/user/:id').delete(deleteUser);
router.route('/changePass').post(verifyjwt, changePass);
router
  .route('/update-ProfilePic')
  .post(verifyjwt, upload.single('ProfilePic'), updateProfilePic);

export default router;
