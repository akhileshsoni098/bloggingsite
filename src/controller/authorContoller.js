const authorModel = require('../model/authorModel');
const emailValidator = require("email-validator");
const jwt = require('jsonwebtoken');

const createAuthor = async function (req, res) {
    try {
        let authorData = req.body;
        if (Object.keys(authorData).length != 0) {
            if(!authorData.fname){
                return res.status(400).send({status:false , msg:"Invalid request , fname is required."});
            }
            if(!authorData.lname){
                return res.status(400).send({status:false , msg:"Invalid request , lname is required."});
            }
            if(!authorData.title){
                return res.status(400).send({status:false , msg:"Invalid request , title is required."});
            }
            if(!authorData.email){
                return res.status(400).send({status:false , msg:"Invalid request , email is required."});
            }
            const uniqueEmail= await author
            if(!emailValidator.validate(authorData.email)){
                return res.status(400).send({status:false , msg:"Invalid email"});
            }
            if(!authorData.password){
                return res.status(400).send({status:false , msg:"Invalid request , password is required."});
            }
            const saveData = await authorModel.create(authorData);
            res.status(201).send({status:true , msg: saveData });
        } else { 
            return res.status(400).send({ status: false, msg: "Invalaid Request" });
        }

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}

const logInAuthor = async function (req, res) {
    try {
        let data = req.body;
        let email = req.body.email;
        let password = req.body.password;
        if (Object.keys(data).length != 0) {
            
            let author = await authorModel.findOne({ email: email, password: password });
            if (!author) {
               return res.status(401).send({ status: false, msg: "Email or password is Incorrect or missing." });
            }
            const token = jwt.sign({ authorId: author._id.toString() }, "team@ak#tapas#Pu#pra#342@");
            res.header("x-api-key", token);
            return res.status(201).send({ status: true, data: { "token": token } });
            
        } else {
            return res.status(400).send({ status: false, msg: "invalid request" });
        }
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}
module.exports.createAuthor = createAuthor;
module.exports.logInAuthor=logInAuthor;