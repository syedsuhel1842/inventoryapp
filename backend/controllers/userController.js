const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const Token = require('../models/tokenModel');
const crypto = require('crypto');
const sendEmail = require('../utiles/sendEmail');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
}

const registerUser= asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please fill all fields');
    }

    if(password.length < 6){
        res.status(400);
        throw new Error('Password must be at least 6 characters');
    }

    const userExists = await User.findOne({ email })
    if(userExists){
        res.status(400);
        throw new Error('Email has already been used');
    }

    const user = await User.create({
        name,
        email,
        password
    })
    
    const token = generateToken(user._id);
    res.cookie('token', token, {
        path: '/',
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), //one day
        sameSite: 'none',
        secure: true
    })


   if(user){
    const { _id, name, email ,photo,phone } = user;

       res.status(201).json({
        _id, name, email ,photo,phone
       })
   }else{
       res.status(400);
       throw new Error('Invalid user data');
   }

})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('Please add the email and password');
    }

    const user = await User.findOne({ email });
    if(!user){
        res.status(400);
        throw new Error('User not found, please sign up');
    }

    const passwordIsCorrect = await bcrypt.compare(password, user.password);
    const token = generateToken(user._id);

    res.cookie('token', token, {
        path: '/',
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400),
        sameSite: 'none',
        secure: true
    })
    

    if(user && passwordIsCorrect){
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            photo: user.photo,
            phone: user.phone,
            token
        });
        
    }else{
        res.status(400);
        throw new Error('Invalid credentials');
    }
})

const logOut = asyncHandler(async (req, res) => {
      
    res.cookie('token',"", {
        path: '/',
        httpOnly: true,
        expires: new Date(0),
        sameSite: 'none',
        secure: true
    })
    return res.status(200).json({
        message: 'User logged out'
    })
});

const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    
    if(user){
        const { _id, name, email ,photo,phone } = user;
    
        res.status(200).json({
            _id, name, email ,photo,phone
        });
    }else{
        res.status(400);
        throw new Error('user not found');
    }
});

const logInStatus = asyncHandler(async (req, res) => {
    const token = req.cookies.token;
    if(!token){
        return res.json(false);
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if(verified){
        return res.json(true);
    }
    return res.json(false);
})

const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.user._id);

    if(user){
        const { name, email ,photo,phone } = user;
        user.email = email;
        user.name = req.body.name || name;
        user.phone = req.body.phone || phone;
        user.photo = req.body.photo || photo;

        const updatedUser = await user.save();
        res.status(200).json({
            _id : updatedUser._id,
            name : updatedUser.name, 
            email : updatedUser.email ,
            photo : updatedUser.photo,
            phone : updatedUser.phone
        })
    }else{
        res.status(400);
        throw new Error('user not found');
    }
})

const changePassword = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const {oldPassword, password} = req.body;

    if(!user){
        res.status(400);
        throw new Error('user not found, please login');
    }

    if(!oldPassword || !password){
        res.status(400);
        throw new Error('Please add the old password and new password');
    }

    const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);

    if(user && passwordIsCorrect){
        user.password = password;
        await user.save();
        res.status(200).json({
            message: 'Password changed successfully'
        })
    }else{
        res.status(400);
        throw new Error('Old password is incorrect');
    }
})

const forgotPassword = asyncHandler(async (req, res) => {
    const {email} = req.body;
    const user = await User.findOne({email});

    if(!user){
        res.status(404);
        throw new Error('User does not exist');
    }

    let token = await Token.findOne({userId: user._id});
    if(token){
        await token.deleteOne();
    }

    let resetToken = crypto.randomBytes(32).toString('hex') + user._id;
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    await new Token({
        userId: user._id,
        token: hashedToken,
        createdAt: Date.now(),
        expiresAt: Date.now() + 30 * (60 * 1000)
    }).save();

    const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

    const message = `
        <h2>Hello ${user.name}</h2>
        <p>Please use the url below to reset your password</p>
        <p>This reset link expires in 30 minutes</p>


        <a href=${resetUrl} clicktracking=off>${resetUrl}</a>

        <p>Regards</p>
        <p><strong>SoftLoom</strong>Team</p>
        `;

    const subject = 'SoftLoom : Password reset request';
    const sent_to = user.email;
    const sent_from = process.env.EMAIL_USER;

    try{
        await sendEmail(subject, message, sent_to, sent_from);
        res.status(200).json({
            success: true,
            message: 'Email sent'
        })
    }catch(err){
        res.status(500);
        throw new Error('Error sending email');
    }   
});

const resetPassword = asyncHandler(async (req, res) => {
    const {password} = req.body;
    const {resetToken} = req.params;

    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    const userToken = await Token.findOne({
        token: hashedToken,
        expiresAt: {
            $gt: Date.now()
        }
    });

    if(!userToken){
        res.status(400);
        throw new Error('Token is not valid or has expired');
    }

    const user = await User.findOne({
        _id: userToken.userId
    })
    user.password = password;
    await user.save();
    res.status(200).json({
        message: 'Password reset successfully'
    })
})

module.exports = {
    registerUser,
    loginUser,
    logOut,
    getUser,
    logInStatus,
    updateUser,
    changePassword,
    forgotPassword,
    resetPassword
}