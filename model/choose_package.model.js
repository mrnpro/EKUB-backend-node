const { MongoClient, ObjectId } = require('mongodb');
const moment = require('moment');
const url = process.env.MONGO_URL;
const client = new MongoClient(url)
const db = client.db("Ekub");
const collectionName = "Accounts";
const { getDays, create90Days, updateDays, addPaid } = require("../model/days.model")
const { getUserAccount } = require('../model/Account.model')

const expire = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDay() + 90);

const choose_package = async(package, id) => {

    try {
        await client.connect();


        const currentUserPackage = await db.collection(collectionName).findOne({ userId: ObjectId(id) });

        //check if the user has already choosen the package

        if (currentUserPackage.package != "none") {
            return `you already chose ${currentUserPackage.package}`;
        }

        await db.collection(collectionName).updateMany({ userId: ObjectId(id) }, {
            $set: {
                "package": "none",
                "packageStartedOn": new Date(),
                "packageExpireOn": expire
            }
        });
        await db.collection("days").insertOne({ userId: ObjectId(id) });


        var days90 = await create90Days(id);

        days90[0] = "paid"
        console.log(days90);
        const response = await updateDays(id, days90);

        console.log(response);



        client.close();
        return `congrats you chose ${package}  `




    } catch (error) {
        return error;
    }

}
module.exports = {
    choose_package,
}