const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Jack',
    email: 'jack59@yahoo.com',
    password: 'jackboy123',
    tokens: [{
        token: jwt.sign({_id: userOneId }, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Arnut',
    email: 'armut@yahoo.com',
    password: 'blackwhite42',
    tokens: [{
        token: jwt.sign({_id: userTwoId }, process.env.JWT_SECRET)
    }]
}

const taskOneId = new mongoose.Types.ObjectId()
const taskOne = {
    _id: taskOneId,
    description:'Clean platters',
    owner: userOneId
}

const taskTwoId = new mongoose.Types.ObjectId()
const taskTwo = {
    _id: taskTwoId,
    description:'Clean garden',
    owner: userOneId
}


const setupDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
}


module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    taskOne,
    taskOneId,
    taskTwo,
    taskTwoId,
    setupDatabase
}