const jwt = require("jsonwebtoken");
const { getUser } = require("../../model/users.model")
const { getUserAccount } = require('../../model/Account.model')
const { currentDay } = require('../CurrentDay/currentDay.controller');
const { getDays, updateDays } = require('../../model/days.model')
const getAccount = async(req, res) => {


    try {


        const { auth } = req.headers;

        //check if the user is authorized
        if (!auth) {
            return res.status(401).send({ "msg": "Unauthorized" })
        }
        const { username, id } = jwt.verify(auth, process.env.JWT_SECRET);
        //getting the usesr
        const user = await getUser(username);

        if (!user) {
            return res.status(401).send({ "msg": "Unauthorized" })
        }


        //checking if the user is exist on the database 
        const resultAccount = await getUserAccount(id);
        if (!resultAccount) {
            return res.status(404).send({ "msg": "user account not found" });
        }

        //calculate current day 
        const DaysResult = await getDays(id);

        const resultFromCurrentDay = currentDay(resultAccount.packageStartedOn);

        // geting all 90 days and assigning to days90 if the user has already choosen the package 
        //if the user didnt choosen package days will be unavailable
        console.log(resultAccount);

        var days90 = ["Days Unavilable"];
        var currentday = 0;
        if (DaysResult) {
            //check if there is penality is the  the function that locates below will return us updated days that contains
            //penality days 
            currentday = resultFromCurrentDay;
            const checkedPenalityDays = checkIfPenality(DaysResult.days, resultFromCurrentDay);

            // we asume that the above method did return us the updated days now , update the users days on the database

            const resultAccount = await updateDays(id, checkedPenalityDays);
            // now we updated the days from the database now it is time to fetch it again and return to user if needed
            const DaysResult2 = await getDays(id);

            days90 = DaysResult2.days
        }

        //return resultAccount ,resultAccount, current day , 
        return res.status(200).send({ "result": resultAccount, days: { days: days90, "currentday": currentday, }, });
    } catch (error) {
        console.log(error);

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

function checkIfPenality(days, currentDay) {
    for (let index = 0; index < currentDay; index++) {
        if (days[index] == "pending") {
            days[index] = "penalty";
        }
    }
    return days;
}

module.exports = { getAccount, }