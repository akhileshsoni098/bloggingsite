
//============================= Importing models author & blog ==============================================

const authorModel = require("../model/authorModel");


const blogModel = require("../model/blogModel");

//================================ To validate unique Object id ============================================

const { isValidObjectId } = require("mongoose");

//==================================== Post API blogs creation ===========================================

const createBlog = async function (req, res) {
    try {
        const blogData = req.body;
        const authorId = blogData.authorId;
        if (Object.keys(blogData).length != 0) {
            if (!authorId || authorId == "") {
                return res.status(400).send({ status: false, msg: "Author id is mandatory" });
            }
            if (!isValidObjectId(authorId)) {
                return res.status(404).send({ status: false, msg: "Invalid author id" });
            }
            const validAuthorId = await authorModel.findById(authorId);
            if (!validAuthorId) {
                return res.status(404).send({ status: false, msg: "Author does not exist with this id" });
            }

            if (!blogData.title || blogData.title == "") {
                return res.status(400).send({ status: false, msg: "Invalid request , title is required." });
            }
            blogData.title = blogData.title.trim();

            if (!blogData.body || blogData.body == "") {
                return res.status(400).send({ status: false, msg: "Invalid request , body is required." });
            }
            blogData.body = blogData.body.trim();

            if (!blogData.category || blogData.category == "") {
                return res.status(400).send({ status: false, msg: "Invalid request , category is required." });
            }

            const saveData = await blogModel.create(blogData);
            return res.status(201).send({ status: true, msg: saveData });
        } else {
            return res.status(400).send({ status: false, msg: "invalid request" });
        }
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
};


//============================== Get API to fetch the blog data ========================================================

const getBlogs = async function (req, res) {
    try {
        let data = req.query;
        if (Object.keys(data).length != 0) {
            const { authorId, category, tags, subcategory } = data;
            if (authorId && !isValidObjectId(authorId)) {
                return res.status(400).send({ status: false, msg: "Invalid Author Id" });
            }
            data["isDeleted"] = false;
            data["isPublished"] = true;
            let blogs = await blogModel.find({ ...data }).populate("authorId");
            if (blogs.length == 0) {
                return res.status(404).send({ status: false, msg: "Data not found." });
            }
            return res.status(200).send({ status: true, data: blogs });
        } else {
            return res.status(400).send({status:false,msg:"Please Give valid Data !! "});
        }
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};

// ====================================== Put API Update the blog data =========================================================


const updateBlog = async function (req, res) {
    try {
        const data = req.body;
        const blogId = req.params.blogId;
        if (Object.keys(data).length != 0) {
            const updateData = await blogModel.findOneAndUpdate(
                { _id: blogId, isDeleted: false },
                {
                    $set: {
                        title: data.title,
                        body: data.body,
                        isPublished: true,
                        publishedAt: new Date(),
                    },
                    $addToSet: { tags: data.tags, subcategory: data.subcategory },
                },
                { new: true }
            );
            return res.status(200).send({ status: true, msg: updateData });
        } else {
            return res.status(400).send({ status: false, msg: "please input something" });
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({ status: false, msg: err.message });
    }
};



// ======================================= Delete API delete data by blog Id ============================================================



const deleteBlog = async function (req, res) {
    try {
        const blogId = req.params.blogId;
        const checkBlogId = await blogModel.findById(blogId);
        if (!checkBlogId || checkBlogId.isDeleted == true) {
            return res
                .status(404)
                .send({ status: false, msg: "Blog already deleted" });
        }
        const deleteBlog = await blogModel.findOneAndUpdate(
            { _id: blogId },
            { $set: { isDeleted: true, deletedAt: Date.now() } },
            { new: true }
        );
        return res
            .status(200)
            .send({ status: true, msg: "Successfully Deleted" });


    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};



//================================== Delete API delete data by filter/searches =============================================



const deleteBlogByFilter = async function (req, res) {
    try {
        const ReqData = req.query;
        const DeleteBlog = await blogModel.updateMany(
            {  ...ReqData,isPublished: false, isDeleted: false },
            { $set: { isDeleted: true } },
            { new: true }
        );
        if (DeleteBlog.matchedCount == 0) {
            return res.status(404).send({ status:false , msg: "Data  Already Deleted or Not Found !!" });
        };
        return res.status(200).send({ status: true, msg: "Data Deleted Sucessfully !!" });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};

// =========================== exporting all function of this blog controller logic module ============================================

module.exports = { deleteBlog, deleteBlogByFilter, createBlog, getBlogs, updateBlog };
