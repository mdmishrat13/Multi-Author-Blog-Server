const express = require('express')
const connectDb = require('./db/connectDb')
require('dotenv').config()
const userRouter = require('./routers/userRouter')
const postRouter = require('./routers/postRouter')
const cookieParser = require('cookie-parser')

const port = process.env.PORT
const app = express()
const uri = process.env.URI

app.use(express.json())
app.use(cookieParser())

app.use('/auth',userRouter)
app.use('/blogs',postRouter)
app.get('/test',(req,res)=>{
    res.send('<h1> Hello World! </h1>')
})

const run = async()=>{
    try {
        await connectDb(uri)
        app.listen(port,()=>{
            console.log('server running')
        })
    } catch (error) {
        console.log(error)
    }
}

run()