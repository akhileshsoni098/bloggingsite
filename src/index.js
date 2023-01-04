const express = require('express')
const route = require('./routes/route')
const mongoose = require('mongoose')
const app = express();

mongoose.set('strictQuery', true)  

app.use(express.json())



mongoose.connect("mongodb+srv://Pal25:Pallavi2552@cluster0.hihf8kq.mongodb.net/Project1-BloggingSite",{useNewUrlParser:true})

.then(()=> console.log("DB is Connected"))
.catch(err => console.log(err))
app.use('/',route);

app.listen( 3000,function () {
    console.log("Express app running on port"+  3000)
})