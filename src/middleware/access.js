

//=========================== Installed jwtwebtoken to authenticate & aurthorize the user ======================

const jwt = require('jsonwebtoken');

//============================= Importing blog model ==============================================

const blogModel = require("../model/blogModel");


//================================ To validate unique Object id ============================================

const { isValidObjectId } = require("mongoose");


// ========================= Authentication With jwt token ============================================================

const authorAuthentication = function (req, res, next) {
    try {
        const token = req.headers["x-api-key"];
        if (!token) {
            return res.status(400).send({ status: false, msg: "Header token is required !" });
        }


        //============================== Token Verification ===========================================

        jwt.verify(token, 'team@ak#tapas#Pu#pra#342@', function (err, decoded) { //callback function
            if (err) {
                return res.status(401).send({ status: false, msg: "Invalid Token !! Please Login Again..." });
            }
            else {
                req.decodedToken = decoded
                next()
            }
        });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }

}

// ======================= Authorisation With Token ==============================================


const authorQueryAuthorisation = async function (req, res, next) {
    try {
        const authorVerified = req.decodedToken.authorId;
        const authorQuery = req.query;
        const authorID=authorQuery.authorId;
        if (Object.keys(authorQuery).length != 0) {
            if (authorQuery.authorId && !isValidObjectId(authorQuery.authorId)) {
                return res.status(400).send({ status: false, msg: "Invalid Author Id..." });
            };
            if(authorQuery.authorId && isValidObjectId(authorQuery.authorId))
            {
            const check = await blogModel.findOne({ authorId:authorID });
            if (!check) {
                return res.status(404).send({ status: false, msg: "Entered wrong authorId..." });
            };
        }
            const blogData = await blogModel.find(authorQuery);
            const validAuthor = blogData.filter(ele => ele.authorId.toString() == authorVerified)
            if (!validAuthor) {
                return res.status(403).send({ status: false, msg: "Author is not authorised" })
            }
            if (validAuthor) {
                next()
            }
        } else {
            return res.status(400).send({ status: false, msg: "Please provide valid Information !!" });
        }
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}


// ======================= Authorisation With Token ==============================================


const authorParamAuthorisation = async function (req, res, next) {
    try {
        const authorVerified = req.decodedToken.authorId;
        let blogID = req.params.blogId;
        if (Object.keys(req.params).length != 0) {
            if (!blogID) {
                return res.status(400).send({ status: false, msg: "Blog ID is Required !!" })
            }
            if (!isValidObjectId(blogID)) {
                return res.status(404).send({ status: false, msg: "Enter Vaild blogId.." });
            }
            const Id = await blogModel.findOne({ _id: blogID })
            if (!Id) {
                return res.status(404).send({ status: false, msg: "Entered wrong blogId .." });
            }
            let blogs = await blogModel.findById(blogID).select({ authorId: 1, _id: 0 });
            let authorId = blogs.authorId;
            if (authorId != authorVerified.toString()) {
                return res.status(403).send({ status: false, msg: "Author not authorised !!" });
            }
            next();

        } else {
            return res.status(400).send({ status: false, msg: "Please provide valid Information !!" });
        }
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

// ==============================Exporting function from this logic module ================================

module.exports = { authorAuthentication, authorParamAuthorisation, authorQueryAuthorisation };
