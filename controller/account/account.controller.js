const jwt = require("jsonwebtoken");
const { getUser } = require("../../model/users.model")
const { getUserAccount } = require('../../model/Account.model')
const { currentDay } = require('../CurrentDay/currentDay.controller');
const { getDays } = require('../../model/days.model')
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
        const DaysResult = await getDays(id);
        const resultFromCurrentDay = currentDay("2022-06-22T15:29:31.435Z");
        console.log(result);
        var days90 = ["Days Unavilable"];
        if (DaysResult) {
            days90 = DaysResult
        }
        return res.status(200).send({ "result": result, days: { days: DaysResult.days, "currentday": resultFromCurrentDay, }, });
    } catch (error) {
        console.log(error);
        return res.status(401).send({ "msg": "authorization failed" })
    }

}

module.exports = { getAccount, }