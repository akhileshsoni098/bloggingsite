const express = require('express')
const router = express.Router()
const AuthorController = require('../controller/authorContoller');
const BlogController = require('../controller/blogController');
const middleware = require('../middleware/access');


router.post('/authors', AuthorController.createAuthor);
router.post('/blogs', BlogController.createBlog);
router.get('/blogs', middleware.authorAuthentication, BlogController.getBlogs);
router.put('/blogs/:blogId', middleware.authorAuthentication, middleware.authorParamAuthorisation, BlogController.updateBlog);
router.delete('/blogs/:blogId', middleware.authorAuthentication,middleware.authorParamAuthorisation, BlogController.deleteBlog);
router.delete('/blogs', middleware.authorAuthentication, middleware.authorQueryAuthorisation, BlogController.deleteBlogByFilter);
router.post('/login', AuthorController.logInAuthor);


module.exports = router;