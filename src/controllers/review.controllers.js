import Movie from '../models/movie.model';
import Review from '../models/review.model';

const AddReviews = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const movieId = req.params.id;
    const userId = req.user._id;

    if (!rating || !comment) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: 'Rating must be between 1 and 5' });
    }

    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const review = await Review.create({
      rating: rating,
      comment: comment,
      user: userId,
      movie: movieId,
    });

    if (!review) {
      return res.status(500).json({ message: 'Failed to create review' });
    }

    return res
      .status(200)
      .json({ review, message: 'movie review successfully' });
  } catch (error) {
    console.log('Error ', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateReview = async () => {
  try {
    const { rating, comment } = req.body;
    const reviewId = req.params.id;
    const userId = req.user._id;

    if (!rating || !comment) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    const review = await Review.findByIdAndUpdate(
      reviewId,
      {
        rating: rating,
        comment: comment,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    return res
      .status(200)
      .json(review, userId, { message: 'Review updated successfully' });
  } catch (error) {
    console.log('Error ', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export { AddReviews, updateReview };
