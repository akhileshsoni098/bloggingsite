
const authorModel = require('../model/authorModel')
const blogModel=require('../model/blogModel');


const createAuthor = async function (req ,res) {
    try{

    let authorData = req.body

    if(Object.keys(authorData).length != 0){
        

    const saveData = await authorModel.create(authorData)

    res.send({msg:saveData})

    } else {return res.status(400).send({status:false , msg: "Invalaid Request"}) }

} catch(err){

    res.status(500).send({status: false , msg: err.message})

}

}

module.exports.createAuthor = createAuthor