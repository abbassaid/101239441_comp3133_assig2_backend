const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        unique: true,
        required: [true, 'username is required']
    },

    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
        validate: {
            validator: function(v) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },

    password: {
        type: String,
        required: [true, 'password is required']
    }
});

// before saving the user, hash the password
userSchema.pre('save', async function(next){
    const salt = 10;
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


const User = mongoose.model('User', userSchema);
module.exports = User;