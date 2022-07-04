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
        //get days 
        const ReceivedDays = await getDays(id);
        //check if the user has days 
        if (!ReceivedDays) {
            return res.status(400).send({ "msg": "days not found please choose package first" })

        }


        //checking if the user has accont
        const account = await getUserAccount(id);
        if (!account) {
            return res.status(400).send({ msg: "no account with this user" });
        }


        // check the current day by substructing the start time package from the current time
        const currentday = currentDay(account.packageStartedOn);
        console.log(currentday);
        var days = ReceivedDays.days;



        //check if the current day status is pending if so ... our target is recharging current day so
        //change to paid
        if (checkIfPending(days, 10)) {
            days[currentday] = "paid"

            //check if there is penalty if there is the  the function that locates below will return us updated days that contains
            //penalty days 
            const checkedPenalityDays = checkIfPenality(days, currentday);

            // we asume that the above method did return us the updated days now , update the users days on the database

            const result = await updateDays(id, checkedPenalityDays);




            //updating the balance after recharged
            //getting the user account to update his /her account balance
            const userAccount = await getUserAccount(id);
            // update balance by multiplying thenumber of paid days with the user account chosen package
            await updateBalance(id, numberofPaid(days) * parseInt(userAccount.package));
            //return the msg to the user 
            return res.status(200).send({ msg: result + " current plan updated " + ", day " + currentday });
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

function checkIfPenality(days, currentday) {
    for (let index = 0; index < currentday; index++) {
        if (days[index] == "pending") {
            days[index] = "penalty";
        }
    }
    return days;
}

module.exports = { recharge, }