

const express = require('express')
const router = express.Router()
const AuthorData = require('../controller/authorContro')




router.post('/authors', AuthorData.createAuthor)




module.exports = router;