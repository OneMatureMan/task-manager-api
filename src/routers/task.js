const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const router = new express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')
const checkIfId = require('../functions/checkIfId')
const mongoose = require('mongoose')


const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('You can only upload an image.'))
        }
        cb(undefined,true)
    }
})

router.post('/tasks/:id', auth, upload.array('images',12), async (req,res) => {
    const _id = req.params.id
    // const buffer = await sharp(req.file.buffer).resize({ width:250, height:250 }).png().toBuffer()
    const task = await Task.findOne({_id, owner:req.user._id})
    
    req.files.map(async (file) => {
        await task.images.push({image:file.buffer})
    })
    
    await task.save()
    res.send()
},  (error,req,res,next) => {
        res.status(400).send({error:error.message})
})

router.get('/tasks/:id/:image_id', async (req,res) => {
    const _id = req.params.id
    const _imageId = req.params.image_id

    try {
        const task = await Task.findOne({_id})
        const image = await task.images.find(img => img._id == _imageId)
        if (!task || !image === null){
            throw new Error()
        }
        const imageBuffer = image.image
        res.set('content-type', 'image/png')
        
        res.send(imageBuffer)
    } catch(e) {
        console.log(e)
        res.status(400).send()
    }
    

})

router.post('/tasks', auth,async (req,res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id,
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
        // console.log(task.images.find(img => img._id == '5f11920bc1584e3e0c15381c'))

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