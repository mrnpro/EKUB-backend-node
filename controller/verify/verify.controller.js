const jwt = require('jsonwebtoken');
const verify = async(auth) => {
    if (!auth) {
        return res.status(401).send({ "msg": "Unauthorized" })
    }
    const { email, id } = jwt.verify(auth, process.env.JWT_SECRET);
    const user = await getUser(email);

    if (!user) {
        return res.status(401).send({ "msg": "Unauthorized" })
    }
    return email, id;
}
module.exports = { verify }