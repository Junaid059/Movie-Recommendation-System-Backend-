import getRecommendationsForUser from '../services/recommendationengine.js';

const getPersonalizedRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const recommendations = await getRecommendationsForUser(userId);
    res.status(200).json(recommendations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching recommendations' });
  }
};

export default getPersonalizedRecommendations;
