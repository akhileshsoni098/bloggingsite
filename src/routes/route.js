

const express = require('express')
const router = express.Router()
const AuthorData = require('../controller/authorController/authorController');
const AuthorData1=require('../controller/blogController/deleteBlogs');




router.post('/authors', AuthorData.createAuthor)
router.delete('/blogs/:blogId1',AuthorData1.deleteBlog1);
router.delete('/blogs/:blogId2',AuthorData1.deleteBlog2);




module.exports = router;