const mongoose = require('mongoose')

if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const initializePassport = require('./passport')
const flash = require('express-flash')
const session = require('express-session')

initializePassport(
    passport,
    email =>  users.find(user => user.email === email)
     )

const users = []

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:false}));
app.use(flash())
app.use(session({
    secret:process.env.SEESSION_SECRET,
    resave:false, 
    saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session())

app.post('/login', passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.post('/register', async(req, res)=>{
    try{
        const hashedpassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id:Date.now().toString(),
            name:req.body.name,
            email:req.body.email,
            password:hashedpassword
        })
        console.log(users);
        res.redirect('/login')
    }catch (e){
console.log(e)
res.redirect('/register')
    }
})

//Route
app.get('/',(req, res)=>{
    res.render('index')
})

app.get('/login',(req, res)=>{
    res.render('login.ejs')
})

app.get('/register',(req, res)=>{
    res.render('register.ejs')
})
//end the Route

let port = 3000
 app.listen(port, ()=> console.log(`${port}`))