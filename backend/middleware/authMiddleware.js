const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const protect = asyncHandler(async (req, res, next) => {
    try{
        let token;
        
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } 
        else if (req.cookies.token) {
            token = req.cookies.token;
        }

        if(!token){
            res.status(401);
            throw new Error('Not authorized, please login');
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(verified.id).select('-password');

        if(!user){
            res.status(401);
            throw new Error('Not authorized, token failed');
        }

        req.user = user;
        next();
    }catch(err){
        res.status(401);
        throw new Error('Not authorized, token failed');
    }
})

module.exports = protect