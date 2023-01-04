const jwt = require('jsonwebtoken');
const blogModel = require("../model/blogModel");

// Add an authorisation implementation for the JWT token that validates the token before every protected endpoint is called. 
//If the validation fails, return a suitable error message with a corresponding HTTP status code
// Protected routes are create a blog, edit a blog, get the list of blogs, delete a blog(s)
// Set the token, once validated, in the request - x-api-key
// Use a middleware for authentication purpose.

const authorAuthentication = function (req, res, next) {
    try {
        const token = req.headers["x-api-key"];
        if (!token) {
            return res.status(400).send({ status: false, msg: "Header token is required !" });
        }
        jwt.verify(token, 'team@ak#tapas#Pu#pra#342@', function (err, decoded) { //callback function

            if (err) {
                return res.status(401).send({ status: false, msg: "User is not varified ! " });
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

// Make sure that only the owner of the blogs is able to edit or delete the blog.
// In case of unauthorized access return an appropirate error message.***For Query****
const authorQueryAuthorisation = async function (req, res, next) {
    try {
        const authorVerified = req.decodedToken.authorId;
        const authorQuery = req.query;
        const blogData = await blogModel.find(authorQuery);
        const validAuthor = blogData.filter(ele => ele.authorId.toString() == authorVerified)
        console.log(validAuthor);
        if (!validAuthor) {
            return res.send({ status: true, msg: "Author not authorised" })
        }
        if (validAuthor) {
            next()
        }
    } catch (err) {
        res.status(500).send({ status: false, msgtry1: err.message })
    }
}

// Make sure that only the owner of the blogs is able to edit or delete the blog.
// In case of unauthorized access return an appropirate error message.****For Param***
const authorParamAuthorisation = async function (req, res, next) {
    try {
        const authorVerified = req.decodedToken.authorId;
        let blogID = req.params.blogId;
        if (!blogID) {
            return res.status(400).send({ status: false, msg: "Blog ID is Required !!" })
        }
        if (blogID) {
            let blogs = await blogModel.findById(blogID).select({ authorId: 1, _id: 0 });
            let authorId = blogs.authorId;
            if (authorId != authorVerified.toString()) {
                return res.status(403).send({ status: false, msg: "Author not authorised !!" });
            }
            next();
        }
    } catch (err) {
        res.status(500).send({ status: false, msgtry2: err.message })
    }
}
module.exports = { authorAuthentication, authorParamAuthorisation, authorQueryAuthorisation };