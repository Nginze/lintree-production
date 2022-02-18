const express = require('express')
const app = express()
const port = process.env.PORT || 3001
const mongoose = require('mongoose')
const path = require('path')
const cors = require('cors')
const SignUp = require('./routes/signup')
const Login = require('./routes/login')
const Users = require('./routes/users')
const passport = require('passport')
const session = require('express-session')
const FileStore = require('session-file-store')(session);

var connection = mongoose.connect('mongodb+srv://Jonathan:guuk12jona@cluster0.vnne0.mongodb.net/linktreeUsers', { useNewUrlParser: true,  useUnifiedTopology: true  },(err)=>{
    if(err){
        console.log(err)
    }
    else{
        console.log('connected to db....')
    }
})
app.use(session({
    store: new FileStore,
    secret: "secret",
    resave: false ,
    saveUninitialized: false ,
    cookie:{
      maxAge:8640000,
    
    }
  }))

app.use(passport.initialize())
app.use(passport.session())

require('./passportConfig')(passport)
app.use(express.static(path.join(__dirname, "build")))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
  origin : 'http://localhost:3000',
  methods:'GET,POST,PATCH,DELETE',
  credentials: true
}))
app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"build", "index.html"))
})
app.use(Login)
app.use(SignUp)
app.use(Users)
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})