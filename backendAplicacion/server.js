const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const PORT = process.env.PORT || 3000
const {LectorQR} = require('./DB')
const app = express()

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cors())

app.get('/',(req,res)=>{
    res.send('Peticion al index')
})

app.get('/users/:uname',(req,res)=>{
    const {uname} = req.params
    LectorQR.findOne({userName:uname}).exec()
        .then(user => res.send(user))
        .catch(err => err.status(404).send(err))
})

app.get('/users',(req,res)=>{
    LectorQR.find().exec()
        .then(users => res.send(users))
        .catch(err => err.status(409).send(err))
})

app.post('/users/qr/:uname',(req,res)=>{
    const {uname} = req.params
    LectorQR.findOneAndUpdate({userName:uname},{$push:req.body},{new:true}).exec()
        .then(userUpdate => res.send(userUpdate))
        .catch(err => res.status(409).send(err))
})

app.post('/users',(req,res)=>{
    const{userName} = req.body
    const newUser = LectorQR({
        userName
    })
    newUser.save((err,newuser)=>{
        err
        ? res.status(409).send('Usuario ya registrado')
        : res.status(201).send(newuser)
    }) 
})

app.listen(PORT,()=>{
    console.log(`Server on Port ${PORT}`)
})
