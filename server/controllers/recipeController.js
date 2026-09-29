const { validationResult } = require('express-validator');
const Recipe = require('../models/Recipe');

const createRecipe = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, ingredients, steps, cookingTime, image, category } = req.body;

    const recipe = await Recipe.create({
      title,
      ingredients,
      steps,
      cookingTime,
      image,
      category,
      createdBy: req.user._id,
    });

    const populatedRecipe = await Recipe.findById(recipe._id).populate('category', 'name');
    res.status(201).json(populatedRecipe);
  } catch (error) {
    next(error);
  }
};

const getRecipes = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalCount = await Recipe.countDocuments();
    const recipes = await Recipe.find()
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      data: recipes,
      page,
      totalPages: Math.ceil(totalCount / limit) || 1,
      totalCount,
    });
  } catch (error) {
    next(error);
  }
};

const getRecipeById = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('category', 'name');
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    next(error);
  }
};

const updateRecipe = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const recipe = await Recipe.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const allowedFields = ['title', 'ingredients', 'steps', 'cookingTime', 'image', 'category'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        recipe[field] = req.body[field];
      }
    });

    const updatedRecipe = await recipe.save();
    const populatedRecipe = await Recipe.findById(updatedRecipe._id).populate('category', 'name');
    res.json(populatedRecipe);
  } catch (error) {
    next(error);
  }
};

const deleteRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    await recipe.deleteOne();
    res.json({ message: 'Recipe removed' });
  } catch (error) {
    next(error);
  }
};

const searchRecipes = async (req, res, next) => {
  try {
    const { q } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { ingredients: { $in: [new RegExp(q, 'i')] } },
      ];
    }

    const totalCount = await Recipe.countDocuments(query);
    const recipes = await Recipe.find(query)
      .populate('category', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      data: recipes,
      page,
      totalPages: Math.ceil(totalCount / limit) || 1,
      totalCount,
    });
  } catch (error) {
    next(error);
  }
};

const favoriteRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const user = req.user;
    if (!user.favorites.some((id) => id.toString() === recipe._id.toString())) {
      user.favorites.push(recipe._id);
      await user.save();
    }

    res.json({ favorites: user.favorites });
  } catch (error) {
    next(error);
  }
};

const getRecipesByCategory = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { category: req.params.id };

    const totalCount = await Recipe.countDocuments(query);
    const recipes = await Recipe.find(query)
      .populate('category', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      data: recipes,
      page,
      totalPages: Math.ceil(totalCount / limit) || 1,
      totalCount,
    });
  } catch (error) {
    next(error);
  }
};

const getQuickRecipes = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { cookingTime: { $lte: 30 } };

    const totalCount = await Recipe.countDocuments(query);
    const recipes = await Recipe.find(query)
      .populate('category', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      data: recipes,
      page,
      totalPages: Math.ceil(totalCount / limit) || 1,
      totalCount,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  searchRecipes,
  favoriteRecipe,
  getRecipesByCategory,
  getQuickRecipes,
};
