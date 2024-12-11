# many-server-porxy

**System Road:**
```
project/
├── servers/
│   ├── server1.js
│   ├── server2.js
│   ├── server3.js
├── models/
│   ├── userModel.js
│   ├── postModel.js
│   ├── commentModel.js
├── proxy.js
├── ecosystem.config.js
├── package.json
├── .env
└── README.md
```

**Hello:**
```
'use strict';
const { Model } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const setImageURLs = require('../utils/imageUrlHelper');
const { setSlug } = require('../utils/generateSlug');
const { validateUUID } = require('../utils/validations');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.hasMany(models.Product, {
        foreignKey: 'categoryId',
        as: 'products',
      });
      Category.hasMany(models.SubCategory, {
        foreignKey: 'categoryId',
        as: 'subCategories',
      });
    }
  }

  Category.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        allowNull: false,
        primaryKey: true,
        validate: {
          isValidUUID(value) {
            validateUUID(value, 'Category ID');
          },
        },
      },
      name_en: DataTypes.STRING,
      name_ar: DataTypes.STRING,
      slug: {
        type: DataTypes.STRING,
        unique: true,
      },
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Category',
      hooks: {
        beforeCreate: (category) => {
          setSlug(category, 'name_en', 'name_ar'); // Generate slug
          const options = { folder: 'categories', imageFields: ['image'] };
          setImageURLs(category, options);
        },
        beforeUpdate: (category) => {
          setSlug(category, 'name_en', 'name_ar'); // Update slug if necessary
          const options = { folder: 'categories', imageFields: ['image'] };
          setImageURLs(category, options);
        },
        afterFind: (categories) => {
          const options = { folder: 'categories', imageFields: ['image'] };
          if (Array.isArray(categories)) {
            categories.forEach((category) => setImageURLs(category, options));
          } else if (categories) {
            setImageURLs(categories, options);
          }
        },
      },
    }
  );

  return Category;
};

const asyncHandler = require("express-async-handler");
const ApiError = require("./apiError");
const ApiResponse = require("./apiResponse");
const checkUniqueField = require("../utils/uniqueCheck");

exports.createOne = (Model, uniqueField) =>
  asyncHandler(async (req, res, next) => {
    // Start a transaction
    const transaction = await Model.sequelize.transaction();

    try {
      await checkUniqueField(Model, uniqueField, req.body);

      const newRecord = await Model.create(req.body, { transaction });

      // Commit the transaction
      await transaction.commit();

      res
        .status(201)
        .json(new ApiResponse(`${Model.name} created successfully`, newRecord));
    } catch (err) {
      // Rollback the transaction in case of errors
      await transaction.rollback();
      return next(err);
    }
  });
// controller 
const { Category } = require('../models');
const {
  createOne,
} = require('../utils/handlersFactory');

exports.createCategory = createOne(Category, 'name', true, "category");

// routes
const express = require("express");
const categoryController = require("../controllers/categoryController");
const {
  uploadCategoryImage,
  resizeImageCategory,
} = require("../services/imagesService");
const authService = require("../services/authService");

const router = express.Router();

// Product Routes
router
  .route("/")
  .get(categoryController.getAllCategories)
  .post(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    categoryController.createCategory,
    uploadCategoryImage,
    resizeImageCategory
  );

module.exports = router;

const asyncHandler = require('express-async-handler');
const { processImageResizing } = require('../utils/imageProcessing');
const { uploadMixOfImages, uploadSingleImage } = require('../utils/fileUpload');

// Upload single image
exports.uploadCategoryImage = uploadSingleImage('image');

// Image processing
exports.resizeImageCategory = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const filename = await processImageResizing(
      req.file.buffer,
      'categories',
      'category'
    );
    req.body.image = filename;
  }

  next();
});
```