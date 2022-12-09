const express = require('express')
const port = 5000
const app = express()


app.get('/test',(req,res)=>{
    res.send('<h1> Hello World! </h1>')
})
app.listen(port,()=>{
    console.log('server running')
})