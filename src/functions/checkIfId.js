const mongoose = require('mongoose')

// This function checks if the id given in the request params is of Object type
const checkIfId = (res, _id) => {
    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(400).send('_id is invalid')
    }
}

module.exports = checkIfId