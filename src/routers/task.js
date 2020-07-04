const express = require('express')
const router = new express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')
const checkIfId = require('../functions/checkIfId')
const mongoose = require('mongoose')


router.post('/tasks', auth,async (req,res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }   
})

// GET / tasks/?sortBy=createdAt:desc

router.get('/tasks', auth, async (req,res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = (req.query.completed === 'true') //returns a boolean
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path:'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)

    } catch (error) {
        res.status(500).send()
    }
})

router.get('/tasks/:id', auth, async (req,res) => {
    const _id = req.params.id 

    try {
        const task = await Task.findOne({_id, owner: req.user._id})

        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send()
    }

})

router.patch('/tasks/:id', auth, async (req,res) => {
    const _id = req.params.id
    const body = req.body
    const updates = Object.keys(body)
    const updatables = ['description','completed']
    const isValidOperation = updates.every(update => updatables.includes(update))

    checkIfId(res, _id)

    if(!isValidOperation){
        res.status(400).send({error:'Invalid update(s)'})
    }


    try {
        const task = await Task.findOne({_id, owner:req.user._id})

        if(!task){
            res.status(404).send()
        }

        updates.forEach(update => task[update] = body[update])
        await task.save()
        
        
        res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }


})

router.delete('/tasks/:id', auth, async (req,res) => {
    const _id = req.params.id
    checkIfId(res,_id)
    try {
        const task = await Task.findOne({_id, owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }

        task.remove()
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})






module.exports = router