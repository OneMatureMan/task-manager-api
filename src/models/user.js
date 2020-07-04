const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const Task = require('./task');
const { Binary } = require('mongodb');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }, 
    email: {
        type: String,
        unique:true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error ('Email is invalid!')
            }
        }
    },
    password: {
        type:String,
        required:true,
        trim:true,
        validate(value) {
            if (validator.contains(value,'password')){
                throw new Error("Your password can't contain 'password'")
            }
            else if (value.length < 6) {
                throw new Error("Please boss, enter a password longer than 6 characters")
            }
        }
    },
    age: {
        type:  Number,
        default: 0,
        validate(value) {
            if (value < 0){
                throw new Error('Cannot have a negative age!')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar: {
        type: Buffer
    }

}, {
    timestamps:true
})

userSchema.virtual('tasks',{
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner',
})

//Generating JWT Token
userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET, { expiresIn: '7 days'})
    
    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}

//limiting the client's access to the data
userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

//Authenticate the user trying to log in
userSchema.statics.findByCredentials = async (email,password) => {
    const user = await User.findOne({ email })
    
    if(!user){
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    
    if (!isMatch){
        throw new Error('Unable to login')
    }
    
    return user
}


// Hash the password before saving the user
userSchema.pre('save', async function (next) {
    const user = this

    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})


// Delete all tasks if the user was deleted
userSchema.pre('remove', async function(next) {
    const user = this
    await Task.deleteMany({owner: user._id})
    next()
})
const User = mongoose.model('User', userSchema)

module.exports = User