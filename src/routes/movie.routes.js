import express from 'express';
import {
  PublishMovie,
  UpdateMovie,
  GetOneMovie,
  GetAllMovies,
  DeleteOneMovie,
  MovieFilter,
} from '../controllers/movie.controllers.js';
import advancedFiltering from '../controllers/advancedFiltering.controller';
import adminAuth from '../middleware/auth.middleware.js';

const router = express.Router();
router.route('/filter').get(advancedFiltering);
routerroute('/publishMovie').post(adminAuth, PublishMovie);
router.route('/updateMovie/:id').put(adminAuth, UpdateMovie);
router.route('/getoneMovie/:id').get(adminAuth, GetOneMovie);
router.route('/getallMovies').get(adminAuth, GetAllMovies);
router.route('/delete/:id').delete(adminAuth, DeleteOneMovie);
router.route('/movieFilter').get(adminAuth, MovieFilter);

export default router;
