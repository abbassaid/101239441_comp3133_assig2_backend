const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(value) {
                //regex to validate email format
                return /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/.test(value);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8, 
        validate: {
            validator: function(value) {
                //regex to validate password 
                return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(value);
            },
            message: props => `Password must contain at least one uppercase letter, one lowercase letter, and one number!`
        }
    }
});

userSchema.pre('save', async function(next) {
    try {
        const user = this;
        if (!user.isModified('password')) return next();
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.isPasswordMatch = async function (password) {
    try {
        const user = this;
        return await bcrypt.compare(password, user.password);
    } catch (error) {
        return false;
    }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
