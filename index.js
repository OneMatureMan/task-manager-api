const express = require('express')
const userRouter = require('./src/routers/user')
const taskRouter = require('./src/routers/task')
require('./src/db/mongoose')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(userRouter,taskRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})