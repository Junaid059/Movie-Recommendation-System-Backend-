import Movie from '../models/movie.model';

const advancedFiltering = async (req, res) => {
  try {
    const {
      genre,
      director,
      year,
      minRating,
      maxRating,
      sortBy = 'createdAt',
      order = 'desc',
      limit = 10,
      page = 1,
    } = req.query;

    const query = {};

    if (genre) {
      query.genre = { $in: genre.split(',') }; // allow multiple genres
    }

    if (director) {
      query.director = director;
    }

    if (year) {
      query.releaseYear = parseInt(year);
    }

    if (minRating || maxRating) {
      query.rating = {};
      if (minRating) query.rating.$gte = parseFloat(minRating);
      if (maxRating) query.rating.$lte = parseFloat(maxRating);
    }

    const sortQuery = {};
    sortQuery[sortBy] = order === 'asc' ? 1 : -1;

    const movies = await Movie.find(query)
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error applying advanced filters' });
  }
};

export default advancedFiltering;
