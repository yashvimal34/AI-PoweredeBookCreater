const jwt = require("jsonwebtoken");
const user = require("../models/User");
const User = require("../models/User");

// Helper: Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

// desc Register new user
// @route POST /api/auth/register
// @access Public

exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please fill the fields" });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create User
        const user = await User.create({ name, email, password });

        if (user) {
            res.status(201).json({
                mesage: "User registered successfully", token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc Login User
// @route POST /api/auth/login
// @access Public
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select("+password");

        if (user && (await user.matchPassword(password))) {
            res.json({
                message: "Login Successfully",
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        }
        else {
            res.status(401).json({ message: "Invalid Credentials" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc Get current logged in-user
// @route GET /api/route/profile
// @access Private
exports.getProfile = async (req, res) => {

    try {
        const user = await User.findById(req.user.id);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            isPro: user.isPro,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }

};

// @desc Update user profile
// @route PUT /api/auth/me
// @access Private
exports.updateUserProfile = async (req, res) => {

    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.name = req.body.name || user.name;

            const updateUser = await user.save();

            res.json({
                _id: updateUser._id,
                name: updateUser.name,
            });
        } else {
            res.status(404).json({ message: "User Not Found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }

};