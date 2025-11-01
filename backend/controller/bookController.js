const Book = require("../models/Book");

// @desc  Create a New Book
// @route  POST  /api/books
// @access  Private
const createBook = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc  Get all books for a user
// @route  Get  /api/books
// @access Private
const getBoos = async (req, res) => {

};

// @desc  Get a single book by ID
// @route  Get /api/books/:id
// @access Private
const getBookById = async (req, res) => {

};