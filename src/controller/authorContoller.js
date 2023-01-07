//============================= Importing author model ==============================================


const authorModel = require('../model/authorModel');

// ==================== Installed external library to validate email ==========================================

const emailValidator = require("email-validator");

//=========================== Installed jwtwebtoken to authenticate & aurthorize the user ======================

const jwt = require('jsonwebtoken');

//====================**Using Regex for validation purpose**====================================================

let nameRegex = /^[a-zA-Z]{1,20}$/
let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

//============================ Post API Resistration with validations ==============================================

const createAuthor = async function (req, res) {
    try {
        let authorData = req.body;
        let { fname, lname, title, email, password } = authorData

        if (Object.keys(authorData).length != 0) {
            if (!fname || fname == "") {
                return res.status(400).send({ status: false, msg: "Invalid request , fname is required." });
            }
            fname = authorData.fname = fname.trim()
            if (!nameRegex.test(fname)) {
                return res.status(400).send({ status: false, msg: "Please provide valid fname" })
            }
            if (!lname || lname == "") {
                return res.status(400).send({ status: false, msg: "Invalid request , lname is required." });
            }
            
            lname = authorData.lname = lname.trim()
            if (!nameRegex.test(lname)) {
                return res.status(400).send({ status: false, msg: "Please provide valid lname" })
            }
            if (!title || title == "") {
                return res.status(400).send({ status: false, msg: "Invalid request , title is required." });
            }
            title = authorData.title = title.trim()
            if (title) {
                if (!(["Miss", "Mrs", "Mr"].includes(title))) {
                    return res.status(400).send({ status: false, msg: "Invalid request , Please provide valid title." });
                }
            }
            if (!email) {

                return res.status(400).send({ status: false, msg: "Invalid request , email is required." });
            }

            if (!emailValidator.validate(email)) {
                return res.status(400).send({ status: false, msg: "Invalid email" });
            }

            const emailExist = await authorModel.findOne({ email: authorData.email })
            if (emailExist) {
                return res.status(400).send({ status: false, msg: "Email Already Exist Try with anothor Email Id" })
            }

            if (!password) {
                return res.status(400).send({ status: false, msg: "Invalid request , password is required." });
            }
            if (!passwordRegex.test(password)) {
                return res.status(400).send({ status: false, msg: "Please provide valid alphanumeric password having minimum character 8" })
            }
            const saveData = await authorModel.create(authorData);
            res.status(201).send({ status: true, msg: saveData });
        } else {
            return res.status(400).send({ status: false, msg: "Invalaid Request" });
        }

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}


// ================================ Genrating unique security token after login =============================================

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


//============================= genrating token with some credantial by secrete-key ===================================

            const token = jwt.sign({ authorId: author._id.toString() }, "team@ak#tapas#Pu#pra#342@");
            res.header("x-api-key",token);
            return res.status(201).send({ status: true, data: { "token": token } });

        } else {
            return res.status(400).send({ status: false, msg: "invalid request" });
        }
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}

// =========================== exporting all function of this author controller logic module ============================================================


module.exports.createAuthor = createAuthor;
module.exports.logInAuthor = logInAuthor;