const authorModel=require('../model/authorModel');
const blogModel = require('../model/blogModel');
const { isValidObjectId } = require("mongoose");

// Create a blog document from request body. Get authorId in request body only.
// Make sure the authorId is a valid authorId by checking the author exist in the authors collection.
// Return HTTP status 201 on a succesful blog creation. Also return the blog document. The response should be a JSON object like this
// Create atleast 5 blogs for each author
// Return HTTP status 400 for an invalid request with a response body like this

const createBlog = async function (req, res) {
    try {
        const blogData = req.body;
        const authorId = blogData.authorId;
        if (Object.keys(blogData).length != 0) {

            if (!authorId) {
                return res.status(400).send({ status: false, msg: "Author id is mandatory" });
            }

            if (!isValidObjectId(authorId)) {
                return res.status(404).send({ status: false, msg: "Invalid author id" });
            }

            if (!blogData.title) {
                return res.status(400).send({ status: false, msg: "Invalid request , title is required." });
            }

            if (!blogData.body) {
                return res.status(400).send({ status: false, msg: "Invalid request , body is required." });
            }

            if (!blogData.category) {
                return res.status(400).send({ status: false, msg: "Invalid request , category is required." });
            }

            if (!blogData.subcategory) {
                return res.status(400).send({ status: false, msg: "Invalid request , subcategory is required." });
            }
            const saveData = await blogModel.create(blogData);

            return res.status(201).send({ status: true, msg: saveData });
        } else { return res.status(400).send({ status: false, msg: "invalid request" }) }
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
};

//Returns all blogs in the collection that aren't deleted and are published
// Return the HTTP status 200 if any documents are found. The response structure should be like this
// If no documents are found then return an HTTP status 404 with a response like this
// Filter blogs list by applying filters. Query param can have any combination of below filters.
// By author Id
// By category
// List of blogs that have a specific tag
// List of blogs that have a specific subcategory example of a query url: blogs?filtername=filtervalue&f2=fv2

const getBlogs = async function (req, res) {
    try {
        let data = req.query
        if (Object.keys(data).length != 0) {
            const { authorId, category, tags, subcategory } = data;
            data["isDeleted"] = false;
            data["isPublished"] = true;
            console.log(data);
            let blogs = await blogModel.find({ ...data }).populate('authorId');
            if (blogs.length == 0) {
                return res.status(404).send({ staus: true, msg: "Data not found." })
            };

            return res.status(200).send({ status: true, data: blogs });
        } else {
            return res.status(404).send("Please Give valid Data !! ")
        }

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });

    }
}

//// ### PUT /blogs/:blogId  Akhilesh ji
// - Updates a blog by changing the its title, body, adding tags, adding a subcategory. (Assuming tag and subcategory received in body is need to be added)
// - Updates a blog by changing its publish status i.e. adds publishedAt date and set published to true
// - Check if the blogId exists (must have isDeleted false). If it doesn't, return an HTTP status 404 with a response body like [this](#error-response-structure)
// - Return an HTTP status 200 if updated successfully with a body like [this](#successful-response-structure) 
// - Also make sure in the response you return the updated blog document.
const updateBlog = async function (req, res) {

    try {
        const data = req.body
        if (Object.keys(data).length != 0) {
            const blogId = req.params.blogId
            if (!blogId) {
                return res.status(400).send({ status: false, msg: "blogId is mendatory" })
            }
            if (!isValidObjectId(blogId)) {
                return res.status(404).send({ status: false, msg: "Enter Vaild blogId" })
            }
            const updateData = await blogModel.findOneAndUpdate(
                { _id: blogId, isDeleted: false },
                {
                    $set: { title: data.title, body: data.body, isPublished: true, publishedAt: new Date() },
                    $addToSet: { tags: data.tags, subcategory: data.subcategory }
                },
                { new: true }
            )
            console.log(updateData)
            return res.status(200).send({ status: true, msg: updateData })
        }
        else {
            return res.status(400).send({ status: false, msg: "please input something" })
        }
    }
    catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: false, msg: err.message })
    }
}


// Check if the blogId exists( and is not deleted). If it does, mark it deleted and return an HTTP status 200 without any response body.
// If the blog document doesn't exist then return an HTTP status of 404 with a body like this

const deleteBlog = async function (req, res) {
    try {
        const blogId = req.params.blogId;

        if (Object.keys(blogId).length != 0) {
            if (!blogId) {
                return res.status(404).send({ status: false, msg: "Document is not valid with this ID." });
            };
            if (!isValidObjectId(blogId)) {
                return res.status(404).send({ status: false, msg: "blog id is not valid" });
            };

            const checkBlogId = await blogModel.findById(blogId);

            if (!checkBlogId || checkBlogId.isDeleted == true) {
                return res.satus(404).send({ status: false, msg: "Blog already deleted" })
            }
            const deleteBlog = await blogModel.findOneAndUpdate(
                { _id: blogId },
                { $set: { isDeleted: true, deletedAt: Date.now() } },
                { new: true }
            );
            return res.status(200).send({ status: true, msg: "Successfully Deleted" });
        } else {
            return res.status(404).send("Please enter valid information !!")
        }
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}

// DELETE /blogs?queryParams
// Delete blog documents by category, authorid, tag name, subcategory name, unpublished
// If the blog document doesn't exist then return an HTTP status of 404 with a body like this

const deleteBlogByFilter = async function (req, res) {

    try {

        const ReqData = req.query;
        if (Object.keys(ReqData).length != 0) {
            if (!isValidObjectId(ReqData.authorId)) {
                return res.status(404).send({ status: false, msg: "Enter Vaild Author Id " })
            };
            const DeleteBlog = await blogModel.updateMany({ ...ReqData, isDeleted: false }, { $set: { isDeleted: true } }, { new: true });
            if (Object.keys(DeleteBlog).length == 0 || DeleteBlog.isDeleted == true) {
                return res.status(404).send({ status: false, msg: "Data Not Found" });
            } else {

                return res.status(200).send({ status: true, msg: "Data Deleted Sucessfully !!" });
            };
        } else {
            return res.status(404).send("Please enter required Data !!")
        }

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });

    }
}


module.exports = { deleteBlog, deleteBlogByFilter, createBlog, getBlogs, updateBlog };