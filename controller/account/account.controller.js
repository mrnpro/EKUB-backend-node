const jwt = require("jsonwebtoken");
const { getUser } = require("../../model/users.model")
const { getUserAccount } = require('../../model/Account.model')

const getAccount = async(req, res) => {


    try {


        const { auth } = req.headers;

        //check if the user is authorized
        if (!auth) {
            return res.status(401).send({ "msg": "Unauthorized" })
        }
        const { username, id } = jwt.verify(auth, process.env.JWT_SECRET);
        const user = await getUser(username);

        if (!user) {
            return res.status(401).send({ "msg": "Unauthorized" })
        }



        const result = await getUserAccount(id);
        if (!result) {
            return res.status(404).send({ "msg": "user account not found" });
        }

        console.log(result);
        return res.status(200).send({ account: result });
    } catch (error) {
        // return res.status(401).send({ "msg": "authorization failed" })
    }

}

module.exports = { getAccount, }