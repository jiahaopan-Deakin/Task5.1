const express = require("express")
const bodyParser = require("body-parser")
const bcrypt = require("bcryptjs")
const mongoose = require("mongoose")
const validator = require("validator")
mongoose.connect("mongodb+srv://admin-jiahao:814821Pjh@cluster0.itsbt.mongodb.net/iServiceDB?retryWrites=true&w=majority", {useNewUrlParser:true})
const app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))

const iServiceSchema = new mongoose.Schema({
    _country:{type: String,
            required: true},
    _firstname:{type: String,
        required: true},
    _lastname:{type: String,
        required: true},
    _email:{type: String,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is not valid!')
            }
        }
    },
    _password:{type: String,
        minLength:8},
    _repassword:{type: String},
    _address:{type: String,
        required: true},
    _city:{type: String,
        required: true},
    _state:{type: String,
        required: true},
    _postcode:Number,
    _phonenumber:Number
})

const IService = mongoose.model('IService', iServiceSchema)

app.get('/', (req,res)=>{
    res.sendFile(__dirname + "/iService.html")
})

app.post('/', (req,res)=>{
    const country = req.body.country
    const firstname = req.body.firstname
    const lastname = req.body.lastname
    const email = req.body.email
    const password = req.body.password
    const repassword = req.body.repassword
    const address = req.body.address
    const city = req.body.city
    const state = req.body.state
    const postcode = req.body.postcode
    const phonenumber = req.body.phonenumber

    const saltRounds = 10
    bcrypt.genSalt(saltRounds, function (err, salt){
        bcrypt.hash(password, salt, function(err, hash){
                password == hash;
        })      
    })

    const iService = new IService({
        _country:country,
        _firstname:firstname,
        _lastname:lastname,
        _email:email,
        _password:password,
        _repassword:repassword,
        _address:address,
        _city:city,
        _state:state,
        _postcode:postcode,
        _phonenumber:phonenumber
    })

    if(password==repassword){
        iService.save((err)=>{
            if(err){
                console.log(err)
            }
            else{
                res.send("Create Successfully")
            }
        })
    }
    else{
        res.send("password diffs")
    }
})

app.get('/login.html', (req,res)=>{
    res.sendFile(__dirname + "/login.html")
})

app.post('/login.html', (req,res)=>{
    const email = req.body.email
    const password = req.body.password

    IService.findOne({_email: email}, function(error, foundUser){
        if(!error){
            if(foundUser){
                if(foundUser._password == password){
                    res.sendFile(__dirname + "/success.html")
                }
            }
            else{
                res.sendFile(__dirname + "/404.html")
            }
        }
    })
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}
app.listen(port, (req,res)=>{
    console.log("server is running on port 5000")
});