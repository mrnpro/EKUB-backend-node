const jwt = require("jsonwebtoken");
const { getUser } = require("../../model/users.model")
const { days } = require("../../model/days.model")

const getDays = async(req, res) => {


    try {

        const package = req.params['pkg'];
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



        //check if the choosen package is the right one


        const result = await days(id);
        console.log(result);
        return res.status(200).send({ msg: result });
    } catch (error) {
        return res.status(401).send({ "msg": "authorization failed" })
    }

}

module.exports = { getDays, }