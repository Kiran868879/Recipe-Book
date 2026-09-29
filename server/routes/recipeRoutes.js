const express = require('express');
const { body } = require('express-validator');
const {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  searchRecipes,
  favoriteRecipe,
  getRecipesByCategory,
  getQuickRecipes,
} = require('../controllers/recipeController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/search', searchRecipes);
router.get('/quick', getQuickRecipes);
router.get('/category/:id', getRecipesByCategory);

router.post(
  '/',
  protect,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('ingredients').isArray({ min: 1 }).withMessage('Ingredients are required'),
    body('steps').isArray({ min: 1 }).withMessage('Steps are required'),
    body('cookingTime').isNumeric().withMessage('Cooking time is required'),
    body('category').notEmpty().withMessage('Category is required'),
  ],
  createRecipe
);

router.get('/', getRecipes);
router.get('/:id', getRecipeById);
router.post('/:id/favorite', protect, favoriteRecipe);
router.put(
  '/:id',
  protect,
  [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('ingredients').optional().isArray({ min: 1 }).withMessage('Ingredients must be a non-empty array'),
    body('steps').optional().isArray({ min: 1 }).withMessage('Steps must be a non-empty array'),
    body('cookingTime').optional().isNumeric().withMessage('Cooking time must be a number'),
  ],
  updateRecipe
);
router.delete('/:id', protect, deleteRecipe);

module.exports = router;
