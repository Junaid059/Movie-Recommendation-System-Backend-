import { upload } from '../middleware/multer.middleware.js';
import Movie from '../models/movie.model';
import uploadOnCloudinary from '../utility/cloudinary.js';

const PublishMovie = async (req, res) => {
  try {
    const { title, description, genre, releaseDate, director, cast } = req.body;

    if (
      !title ||
      !description ||
      !genre ||
      !releaseDate ||
      !director ||
      !cast
    ) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    const ExistedMovie = await Movie.findOne({ title });

    if (ExistedMovie) {
      return res.status(409).json('Movie already exits');
    }

    const thumbnailurl = req.files?.thumbnail?.[0]?.path;

    if (!thumbnailurl) {
      return res.status(400).json({ message: 'Please upload thumbnail' });
    }

    const thumbnail = await uploadOnCloudinary(thumbnailurl);

    if (!thumbnail) {
      return res.status(400).json({ message: 'Failed to upload thumbnail' });
    }

    const movieurl = req.files?.movie?.[0]?.path;

    if (!movieurl) {
      return res.status(400).json({ message: 'Please upload movie' });
    }

    const uploadMovie = await uploadOnCloudinary(movieurl);

    if (!uploadMovie) {
      return res.status(400).json({ message: 'Failed to upload movie' });
    }

    const movie = await Movie.create({
      title,
      description,
      genre,
      releaseDate,
      director,
      cast,
      rating,
      thumbnail: thumbnail.url,
      movie: uploadMovie.url,
    });

    if (!movie) {
      return res.status(400).json({ message: 'Failed to create movie' });
    }

    return res
      .status(200)
      .json({ movie, message: 'Movie Published successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const UpdateMovie = async (req, res) => {
  try {
    const { movieID } = req.params;

    let updatedFiles = {
      title: req.body.title,
      description: req.body.description,
      genre: req.body.genre,
      releaseDate: req.body.releaseDate,
      director: req.body.director,
      cast: req.body.cast,
    };

    if (req.files?.thumbnail?.[0]?.path) {
      const uploadThumbnail = await uploadOnCloudinary(
        req.files?.thumbnail?.[0].path
      );

      if (!uploadThumbnail) {
        return res.status(400).json({ message: 'Failed to upload thumbnail' });
      }

      updatedFiles.thumbnail = uploadThumbnail.url;
    }

    if (req.files?.movie?.[0]?.path) {
      const uploadMovie = await uploadOnCloudinary(req.files?.movie?.[0].path);

      if (!uploadMovie) {
        return res.status(400).json({ message: 'Failed to upload movie' });
      }

      updatedFiles.movie = uploadMovie.url;
    }

    const movie = await Movie.findByIdAndUpdate(
      movieID,
      {
        $set: updatedFiles,
      },
      {
        new: true,
      }
    );

    if (!movie) {
      return res.status(404).json({ message: 'Movie not updated' });
    }

    return res
      .status(200)
      .json({ movie, message: 'Movie updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const GetOneMovie = async (req, res) => {
  try {
    const { movieID } = req.params;

    if (!movieID) {
      return res.status(400).json({ message: 'Movie ID is required' });
    }

    const movie = await Movie.findById(movieID);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    return res.status(200).json({ movie, message: 'Movie found' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const GetAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();

    if (!movies) {
      return res.status(404).json({ message: 'No movies found' });
    }

    return res.status(200).json({ movies, message: 'All movies fetched' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const DeleteOneMovie = async (req, res) => {
  try {
    const { movieID } = req.params;

    if (!movieID) {
      return res.status(400).json({ message: 'Movie ID is required' });
    }

    const movie = await Movie.findByAndDelete(movieID);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    return res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const MovieFilter = async (req, res) => {
  try {
    const { title, genre, director, actor } = req.query;

    const filter = {};

    if (title) {
      filter.title = { $regex: title, $options: 'i' };
    }

    if (genre) {
      filter.genre = { $regex: genre, $options: 'i' };
    }

    if (director) {
      filter.director = { $regex: director, $options: 'i' };
    }

    if (actor) {
      filter.actor = { $regex: actor, $options: 'i' };
    }

    const movies = await Movie.find(filter);

    if (movies.length === 0) {
      return res.status(404).json({ message: 'No movies found' });
    }

    return res.status(200).json({ movies, message: 'movies found' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export {
  PublishMovie,
  UpdateMovie,
  GetOneMovie,
  GetAllMovies,
  DeleteOneMovie,
  MovieFilter,
};
