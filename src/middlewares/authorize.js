var jwt = require('jsonwebtoken');
const message = require('../util/message.json')

const authorize = async (req, res, next) => {
try {
    const token = req.headers.authorization;
    const data = await jwt.verify(token, process.env.SECRET)
    if(!data) {
        console.log("Token validation Error")
        return res.status(401).json({ Status: "Error", Message: message.TOKEN })
    }

    req.user = data

    return next()
}
catch(err) {
    console.log("Authorization Error: ", err.message)
    return res.status(401).json({ Status: "Error", Message: err.message })
}
}

module.exports = authorize