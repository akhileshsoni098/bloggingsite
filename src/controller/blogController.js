
const authorModel = require('../model/authorModel');
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
        if (!authorId) {
            return res.status(400).send({ status: false, msg: "Author id is mandatory" });
        }

        if (!isValidObjectId(authorId)) {
            return res.status(404).send({ status: false, msg: "Invalid author id" });
        }
        const saveData = await blogModel.create(blogData);
        return res.status(201).send({ status: true, msg: saveData });
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
        const { authorId, category, tags, subcategory } = data;
        console.log(data);
        data["isDeleted"] = false;
        data["isPublished"] = true;
        let blogs = await blogModel.find(data);

        if (!blogs) {
            return res.status(404).send({ staus: true, msg: "Data not found." })
        } else {
            return res.status(200).send({ status: true, data: blogs });
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
const update = async function (req, res) {

    try {

        const data = req.body

        const blogId = req.params.blogId

        if (!blogId) {

            return res.status(400).send({ status: false, msg: "blogId is mendatory" })

        }

        if (!isValidObjectId(blogId)) {

            return res.status(404).send({ status: false, msg: "Enter Vaild blogId" })

        }

        const updateData = await blogModel.findOneAndUpdate({ _id: blogId, isDeleted: false },

            {
                $set: {
                    title: data.title, subcategory: data.subcategory, body: data.body, isPublished: true,

                    tags: data.tags, publishedAt: new Date()
                }
            }, { new: true })

        return res.status(200).send({ status: true, msg: updateData })

    }

    catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: false, msg: err.message })

    }

}


// Check if the blogId exists( and is not deleted). If it does, mark it deleted and return an HTTP status 200 without any response body.
// If the blog document doesn't exist then return an HTTP status of 404 with a body like this

const deleteBlog1 = async function (req, res) {
    try {
        const body = req.params.blogId;
        const checkBlogId = await blogModel.findById(body);
        if(!isValidObjectId || !checkBlogId)
        {
            return res.status(404).send({status:false,msg:"Blog Id is Invalid"});
        }
        
        if (isDeleted == false) {
            const updateDelete = await blogModel.findOneAndUpdate({ _id: body }, { $set: { isDeleted: true } }, { new: true });
        };

        return res.status(200).send(" ");
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }

}

// DELETE /blogs?queryParams
// Delete blog documents by category, authorid, tag name, subcategory name, unpublished
// If the blog document doesn't exist then return an HTTP status of 404 with a body like this

const deleteBlog2 = async function (req, res) {
    const body = req.query;
    const { category, authorId, tags, subcategory, isPublished } = body;
   






    if(isPublished == false)
    {
    const Filterdoc = await blogModel.find(body);

    const deletedData= await blogModel.findOneAndDelete(Filterdoc)
    }
   

}

moduule.exports = { deleteBlog1, deleteBlog2, createBlog, getBlogs, update };


//const blog = await BlogModel.findOneAndUpdate({_id:blogId,isDeleted:false,isPublished:true}, {title:data.title,body:data.body,$push: {tags:data.tags,subcategory:data.subcategory},category:data.category}, { new: true })


