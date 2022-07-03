const jwt = require("jsonwebtoken");
const { getUser } = require("../../model/users.model")
const { rechargeDily } = require("../../model/recharge.model")
const { getDays, create90Days, updateDays, } = require("../../model/days.model")
const { getUserAccount, updateBalance } = require('../../model/Account.model')
const { currentDay } = require('../CurrentDay/currentDay.controller')
const recharge = async(req, res) => {


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
        const ReceivedDays = await getDays(id);

        if (!ReceivedDays) {
            return res.status(400).send({ "msg": "days not found please choose package first" })

        }
        if (!ReceivedDays.days) {
            //   await addPaids;
            await create90Days(id);

        }
        const account = await getUserAccount(id);

        if (!account) {
            return res.status(400).send({ msg: "no account with this user" });
        }

        // const daysDeference = new Date().getTime() - new Date(account.packageStartedOn).getTime();

        const daysLength = currentDay("2022-06-22T15:29:31.435Z");
        console.log(daysLength);

        var days = ReceivedDays.days;
        console.log(days);
        console.log(typeof(daysLength));
        if (checkIfPending(days, 10)) {
            days[daysLength] = "paid"

            const checkedPenalityDays = checkIfPenality(days, daysLength);
            const result = await updateDays(id, checkedPenalityDays);




            //updating the balance after recharged
            const userAccount = await getUserAccount(id);
            await updateBalance(id, numberofPaid(days) * parseInt(userAccount.package));

            return res.status(200).send({ msg: result + " current plan updated " + ", day " + daysLength });
        }




        return res.status(400).send({ msg: "you already recharged the plan" });
    } catch (error) {
        console.log(error);
        return res.status(401).send({ "msg": "authorization failed" })
    }


}

function numberofPaid(days90) {
    var sumofPaid = 0;
    for (let index = 0; index <= days90.length; index++) {
        if (days90[index] == "paid") {
            sumofPaid++;
        }
    }
    return sumofPaid;
}

function checkIfPending(days90, index) {
    if (days90[index] == "pending") {
        return true;
    }
    return false;
}

function checkIfPenality(days, daysLength) {
    for (let index = 0; index <= daysLength; index++) {
        if (days[index] == "pending") {
            days[index] = "penality";
        }
    }
    return days;
}

module.exports = { recharge, }