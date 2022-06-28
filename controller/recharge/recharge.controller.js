const jwt = require("jsonwebtoken");
const { getUser } = require("../../model/users.model")
const { rechargeDily } = require("../../model/recharge.model")
const { getDays, create90Days, updateDays, addPaid } = require("../../model/days.model")
const { getUserAccount } = require('../../model/Account.model')

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
            await addPaid(id);
            await create90Days(id);

        }
        const account = await getUserAccount(id);

        if (!account) {
            return res.status(400).send({ msg: "no account with this user" });
        }

        // const daysDeference = new Date().getTime() - new Date(account.packageStartedOn).getTime();
        const daysDeference = new Date().getTime() - new Date("2022-06-22T15:29:31.435Z").getTime();
        const daysLength = new Date(daysDeference).getDate() - 1;

        console.log(daysLength);

        var days = ReceivedDays.days;
        if (checkIfPending(days, daysLength)) {
            days[daysLength] = "paid"

            const checkedPenalityDays = checkIfPenality(days, daysLength);
            const result = await updateDays(id, checkedPenalityDays);
            return res.status(200).send({ msg: result + " current plan updated " + ", day " + daysLength });
        }

        return res.status(400).send({ msg: "you already recharged the plan" });
    } catch (error) {
        return res.status(401).send({ "msg": "authorization failed" })
    }

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