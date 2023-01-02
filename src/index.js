const express = require('express')
var bodyParser = require('body-parser')
const route = require('./routes/route')

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

const mongooge = require('mongoose')
mongoose.set('strict.Query', true)

mongoose.connect("mongodb+srv://Pal25:Pallavi2552@cluster0.hihf8kq.mongodb.net/Project1-Dummy",{useNewUrlParser:true})
.then(()=> console.log("Project 1 blogs"))
.catch(err => console.log(err))
app.use('/',route);
app.listen(process.env.PORT || 3000,function () {
    console.log("Express app running on port"+ (process.env.PORT || 3000))
})

