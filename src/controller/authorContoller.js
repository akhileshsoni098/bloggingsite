
const authorModel = require('../model/authorModel')
const blogModel=require('../model/blogModel');


const createAuthor = async function (req ,res) {
    let authorData = req.body
    const saveData = await authorModel.create(authorData)

    res.send({msg:saveData})
}

module.exports.createAuthor = createAuthor