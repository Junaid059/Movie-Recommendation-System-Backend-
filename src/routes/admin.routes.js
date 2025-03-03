import express from 'express';
import {
  registerAdmin,
  getAllUsers,
  getSingleUser,
  loginAdmin,
  logoutAdmin,
  UpdateAdmin,
  UpdateAdminPass,
} from '../controllers/admin.controller';
import adminAuth from '../middleware/auth.middleware';

const router = express.Router();

router.route('/register-admin').post(adminAuth, registerAdmin);
router.route('/login-admin').post(loginAdmin);
router.route('/logout-admin').post(adminAuth, logoutAdmin);
router.route('/update-admin').put(adminAuth, UpdateAdmin);
router.route('/update-adminPass').put(adminAuth, UpdateAdminPass);
router.route('/user/getAll').get(adminAuth, getAllUsers);
router.route('/user/:id').get(adminAuth, getSingleUser);
