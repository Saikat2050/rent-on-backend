var jwt = require('jsonwebtoken');

const authorize = async (req, res, next) => {
try {
    const token = req.headers.authorization;
    const data = await jwt.verify(token, process.env.SECRET)
    if(!data) {
        console.log("Token validation Error")
        return next()
    }

    req.user = data

    return next()
}
catch(err) {
    console.log("Authorization Error: ", err.message)
    return next();
}
}

module.exports = authorize