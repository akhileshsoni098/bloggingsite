const express = require('express')
const router = express.Router()
const AuthorController = require('../controller/authorContoller');
const BlogController = require('../controller/blogController');


router.post('/authors', AuthorController.createAuthor);
router.post('/blogs' , BlogController.createBlog); 
router.get('/blogs' , BlogController.getBlogs);
router.put('/blogs/:blogId' , BlogController.updateBlog);
router.delete('/blogs/:blogId' , BlogController.deleteBlog);
router.delete('/blogs' , BlogController.deleteBlogByFilter);


module.exports = router;