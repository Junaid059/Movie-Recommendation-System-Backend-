import Movie from '../models/movie.model.js';
import Review from '../models/review.model.js';
import User from '../models/user.model';

const cosineSimilarity = (vecA, vecB) => {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dot / (magA * magB);
};

const getRecommendationsForUser = async (userId) => {
  const users = await User.find();
  const movies = await Movie.find();
  const reviews = await Review.find();

  const userMovieMatrix = {};

  reviews.forEach((r) => {
    const uId = r.userId.toString();
    const mId = r.movieId.toString();
    if (!userMovieMatrix[uId]) userMovieMatrix[uId] = {};
    userMovieMatrix[uId][mId] = r.rating;
  });

  const targetUserRatings = userMovieMatrix[userId];
  if (!targetUserRatings) return [];

  const similarities = [];

  for (let otherUserId in userMovieMatrix) {
    if (otherUserId === userId) continue;
    const otherRatings = userMovieMatrix[otherUserId];

    const commonMovies = Object.keys(targetUserRatings).filter(
      (id) => otherRatings[id]
    );
    if (commonMovies.length === 0) continue;

    const vecA = commonMovies.map((id) => targetUserRatings[id]);
    const vecB = commonMovies.map((id) => otherRatings[id]);

    const sim = cosineSimilarity(vecA, vecB);
    similarities.push({ userId: otherUserId, similarity: sim });
  }

  const scores = {};
  similarities.forEach(({ userId, similarity }) => {
    const otherRatings = userMovieMatrix[userId];
    for (let movieId in otherRatings) {
      if (!targetUserRatings[movieId]) {
        scores[movieId] =
          (scores[movieId] || 0) + otherRatings[movieId] * similarity;
      }
    }
  });

  const recommended = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const recommendedMovies = await Movie.find({
    _id: { $in: recommended.map((r) => r[0]) },
  });
  return recommendedMovies;
};

export default getRecommendationsForUser;
