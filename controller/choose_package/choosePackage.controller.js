const jwt = require("jsonwebtoken");
const { getUser } = require("../../model/users.model")
const { updateBalance } = require("../../model/Account.model")
const { choose_package } = require('../../model/choose_package.model')
const packages = {
    50: "5000 birr after 3 month",
    100: "10,000 birr after 3 month",
    200: "20,000 birr after 3 month",
}
const getPackages = (req, res) => {
    return res.status(200).send(packages);
}
const choosePackage = async(req, res) => {
    try {

        const package = req.params['pkg'];
        const { auth } = req.headers;
        console.log("hey");
        //check if the user is authorized
        if (!auth) {
            console.log("ther is no auth");
            return res.status(401).send("Unauthorized")

        }
        const { username, id } = jwt.verify(auth, process.env.JWT_SECRET);
        console.log(username);
        const user = await getUser(username);

        if (!user) {

            return res.status(401).send("Unauthorized")
        }



        //check if the choosen package is the right one
        if (!packages[package]) {
            return res.status(400).send("this package not found yet!!!")
        }

        const result = await choose_package(package, id);
        await updateBalance(id, `${package}`);
        console.log(result);
        return res.status(200).send({ msg: result });
    } catch (error) {
        return res.status(401).send("authorization failed")
    }

}
module.exports = { choosePackage, getPackages }