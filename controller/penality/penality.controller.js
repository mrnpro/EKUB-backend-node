 const jwt = require("jsonwebtoken");
 const { getUser } = require("../../model/users.model")
 const { rechargeDily } = require("../../model/recharge.model")
 const { getDays, create90Days, updateDays, addPaid } = require("../../model/days.model")
 const { getUserAccount, updateBalance } = require('../../model/Account.model')

 const getPenalityAmount = async(req, res) => {

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
         try {


             const ReceivedDays = await getDays(id);
             if (!ReceivedDays) {
                 return res.status(400).send({ "msg": "days not found please choose package first" })

             }
             //console.log(ReceivedDays.days);
             const resultTotalUnpaidDays = await totalUnpaidDays(ReceivedDays.days, id);
             const resultPenalities = calculatePenality(ReceivedDays.days);
             return res.status(200).send({
                 "msg": {
                     "total unpaid plan Bill": resultTotalUnpaidDays + " ETB",
                     "total penality Bill": resultPenalities + " ETB",
                     "total": resultPenalities + resultTotalUnpaidDays + " ETB"
                 }
             })
         } catch (error) {
             res.status(400).send({ "msg": error })
         }

     } catch (error) {
         return res.status(401).send({ "msg": "authorization failed" })
     }
 }
 const payPenality = async(req, res) => {

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
         try {


             const ReceivedDays = await getDays(id);
             if (!ReceivedDays) {
                 return res.status(400).send({ "msg": "days not found please choose package first" })

             }
             console.log(ReceivedDays.days);
             //check if there is penality
             if (checkIfPenality(ReceivedDays.days)) {
                 //console.log(ReceivedDays.days);
                 const resultPenalities = calculatePenality(ReceivedDays.days);
                 //set pay
                 await updateDays(id, updateAllPenality(ReceivedDays.days))

                 //updating balance after paid penality
                 await updateBalance(id, numberofPaid(days) * await getUserAccount(id).package);

                 return res.status(200).send({ "msg": "You have successfully paid all your penalities" })
             }
             return res.status(400).send({ "msg": "WOHOO!! You dont have any penalities " })

         } catch (error) {
             res.status(400).send({ "msg": error })
         }

     } catch (error) {
         return res.status(401).send({ "msg": "authorization failed" })
     }
 }

 function numberofPaid(days90) {
     var sumofPaid = 0;
     for (let index = 0; index <= days90; index++) {
         if (days[index] == "paid") {
             sumofPaid++;
         }
     }
     return sumofPaid;
 }

 function checkIfPenality(days) {
     console.log(days);
     if (days.includes('penality')) {
         console.log("yap");
         return true;
     }


     return false;
 }

 const totalUnpaidDays = async(days, id) => {
     const account = await getUserAccount(id)

     var total = 0;
     for (let index = 0; index < days.length; index++) {
         if (days[index] === 'penality') {
             total++;
         }

     }
     console.log(account.package);
     return total * parseInt(account.package);
 }

 function updateAllPenality(days) {
     for (let index = 0; index < days.length; index++) {
         if (days[index] === 'penality') {
             days[index] = 'paid';
         }

     }
     return days;

 }

 function calculatePenality(days) {

     var numberOfPenalities = 0;
     for (let index = 0; index < days.length; index++) {
         if (days[index] === 'penality') {
             numberOfPenalities++;
         }

     }
     console.log(numberOfPenalities);
     return numberOfPenalities * 5;

 }
 module.exports = { getPenalityAmount, payPenality }