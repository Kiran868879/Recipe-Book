const express = require('express');
const { body } = require('express-validator');
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
  '/',
  protect,
  [
    body('name').trim().notEmpty().withMessage('Category name is required'),
  ],
  createCategory
);

router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.put(
  '/:id',
  protect,
  [
    body('name').optional().trim().notEmpty().withMessage('Category name cannot be empty'),
  ],
  updateCategory
);
router.delete('/:id', protect, deleteCategory);

module.exports = router;
