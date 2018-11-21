const mongoose = require('mongoose');
const URL = 'Tu URL'
mongoose.connect(URL,{useNewUrlParser:true},()=>{
    console.log('Conexion exitosa a la base de datos')
})

const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.ObjectId

const CodigosQR = new Schema({
    id_QR:ObjectId,
    QR:String
})

const UserSchema = new Schema({
    id:ObjectId,
    userName:{
        type: String,
        required: true,
        unique: true
    },
    codigos:[CodigosQR]
})

const LectorQR = mongoose.model('LectorQR',UserSchema)

module.exports = {LectorQR}