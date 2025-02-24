import express from 'express';
import registerAdmin from '../controllers/admin.controller';
import adminAuth from '../middleware/auth.middleware';

const router = express.Router();

router.route('/register-admin').post(adminAuth, registerAdmin);
