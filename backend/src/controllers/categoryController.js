const { Category } = require('../models');
const response = require('../utils/response');

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({ order: [['id', 'ASC']] });
    return response.success(res, categories, 'Categories retrieved successfully');
  } catch (err) {
    next(err);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    // Check duplication
    const existing = await Category.findOne({ where: { name } });
    if (existing) {
      return response.error(res, 'Category name already exists', 400);
    }
    const category = await Category.create({ name });
    return response.success(res, category, 'Category created successfully', 201);
  } catch (err) {
    next(err);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      return response.error(res, 'Category not found', 404);
    }

    // Check duplicate name
    if (name && name !== category.name) {
      const existing = await Category.findOne({ where: { name } });
      if (existing) {
        return response.error(res, 'Category name already exists', 400);
      }
      category.name = name;
    }

    await category.save();
    return response.success(res, category, 'Category updated successfully');
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) {
      return response.error(res, 'Category not found', 404);
    }

    await category.destroy();
    return response.success(res, null, 'Category deleted successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
