// const { MongoClient, ObjectId } = require('mongodb');
// const moment = require('moment');
// const url = process.env.MONGO_URL;
// const client = new MongoClient(url)
// const db = client.db("Ekub");
// const collectionName = "days";
// const { getUserAccount } = require('./Account.model')
// const rechargeDaily = async(userId) => {
//     //console.log("hey");
//     try {
//         await client.connect();


//         const ReceivedDays = await db.collection(collectionName).findOne({ userId: ObjectId(userId) });


//         if (!ReceivedDays.days) {
//             await db.collection(collectionName).updateOne({ userId: ObjectId(userId) }, {

//                 $push: { days: "paid" }
//             });
//             for (let index = 0; index < 90; index++) {
//                 await db.collection(collectionName).updateOne({ userId: ObjectId(userId) }, {

//                     $push: { days: "pending" }
//                 });

//             }
//             return "recharged successfully"
//         } else {

//             const account = await getUserAccount(userId);
//             if (!account) {
//                 console.log("no account with user id ");
//             }
//             const ReceivedDays = await db.collection(collectionName).findOne({ userId: ObjectId(userId) });
//             // const daysDeference = new Date().getTime() - new Date(account.packageStartedOn).getTime();
//             const daysDeference = new Date().getTime() - new Date("2022-06-25T13:39:59.650+00:00").getTime();
//             const daysLength = new Date(daysDeference).getDate();

//             console.log(daysLength);




//             var days = ReceivedDays.days;
//             days[daysLength] = "paid"

//             for (let index = 0; index <= daysLength; index++) {
//                 if (days[index] == "pending") {
//                     days[index] = "penality";
//                 }
//             }
//             await db.collection(collectionName).updateMany({ userId: ObjectId(userId) }, {
//                 $set: {
//                     "days": days
//                 }
//             });
//             ReceivedDays.days = days;
//             console.log(ReceivedDays.days);



//             //await db.collection(collectionName).updateOne({ userId: ObjectId(userId) }, {

//             //     $set: {
//             //    "days.$.1": "paid"
//             //     }
//             //});









//         }
//         client.close();
//         return ReceivedDays;



//     } catch (error) {
//         console.log(error);
//     }

// }
// module.exports = {
//     rechargeDaily,
// }