const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller.js');

router.get('/', bookController.getBooks)
router.get('/recent', bookController.getRecentBooks)
router.get('/:id', bookController.getBookById)
router.post('/', bookController.createBook)
router.put('/:id', bookController.updateBook)
router.delete('/:id', bookController.deleteBook)

module.exports = router;
