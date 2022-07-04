const { MongoClient, ObjectId } = require('mongodb');
const moment = require('moment');
const url = process.env.MONGO_URL;
const client = new MongoClient(url)
const db = client.db("Ekub");
const collectionName = "days";
const expire = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDay() + 90);

const getDays = async(userId) => {

    var days = ["Days Unavilable"];
    try {
        await client.connect();


        const ReceivedDays = await db.collection(collectionName).findOne({ userId: ObjectId(userId) });

        client.close();
        if (!ReceivedDays) {
            console.log("days not found");

        }



        return ReceivedDays;


    } catch (error) {
        return error;
    }

}
const updateDays = async(userId, days) => {
    await client.connect();

    await db.collection(collectionName).updateMany({ userId: ObjectId(userId) }, {
        $set: {
            "days": days
        }
    });
    await client.close();

    return "days updated";
}

const create90Days = async(userId) => {
    await client.connect();
    var days90 = [];
    for (let index = 0; index < 90; index++) {
        days90[index] = "pending";
    }
    const res = await db.collection("days").updateMany({ userId: ObjectId(userId) }, {

        $push: { "days": days90.days }
    });

    await client.close();
    console.log(res);
    return days90;
}
module.exports = {
    getDays,
    updateDays,

    create90Days
}