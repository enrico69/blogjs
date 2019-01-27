// Config
const express = require('express');
const router = express.Router();

// Controllers
const homeController = require('../controllers/Home');
const articleController = require('../controllers/Article');
const categoryController = require('../controllers/Category');
const contactController = require('../controllers/Contact');
const searchController = require('../controllers/Search');

// /!\ : REMEMBER that the order of the routes is important!

// Home
router.get('/', homeController.index);

// View an article
router.get('/:category/:article/', articleController.viewArticle);

// View categories
router.get('/categories/', categoryController.index);

// Contact page
router.get('/contact/', contactController.index);
router.post('/contact/', contactController.submit);

// View a category
router.get('/:category/', categoryController.viewCategory);

// Search function
router.post('/search/', searchController.index);

module.exports = router;
