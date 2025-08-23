const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        trim: true,
        match: [ /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                'Please add a valid email']
    },
    password:{
        type:String,
        minLength: [6, 'Password must be at least 6 characters'],
    },
    photo:{
        type:String,
        required:[true, 'Please add a photo'],
        default:'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
    },
    phone:{
        type:String,
        trim: true,
        default:'+213'
    },
 
}, {timestamps: true});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
       return next();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next(); 
})

const User = mongoose.model('User', userSchema);
module.exports = User;