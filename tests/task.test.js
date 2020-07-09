const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const {userOne,userTwo,taskOne,taskOneId,taskTwo,taskTwoId,setupDatabase} = require('./fixtures/db')

beforeEach(setupDatabase)


test('Should create a task for user one', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description:'Create a blog'
        })
        .expect(201)
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toBe(false)
})


test('Should create a task for user two', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send({
            description:'Play around and mess around'
        })
        .expect(201)
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toBe(false)
})


test('User one Should access user one tasks', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
})

test('Should not access tasks when not authorized', async () => {
    await request(app)
        .get('/tasks')
        .expect(401)
})

test('Should give access to the task task by Id ', async () => {
    await request(app)
        .get(`/tasks/${taskOneId}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)
    
})

test('Should not give access to the task by Id ', async () => {
    await request(app)
        .get(`/tasks/${taskOneId}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .expect(404)
    
})

test('User two should not delete user one tasks', async () => {
    await request(app)
        .delete(`/tasks/${taskOneId}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .expect(404)
    const tasks = await Task.find({owner:userOne._id})
    expect(tasks.length).toBe(2)
})