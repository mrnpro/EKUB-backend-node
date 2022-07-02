const { MongoClient, ObjectId } = require('mongodb');
const moment = require('moment');
const url = process.env.MONGO_URL;
const client = new MongoClient(url)
const db = client.db("Ekub");
const collectionName = "Accounts";
const getUserAccount = async(userId) => {

    await client.connect();
    const userAccount = await db.collection(collectionName).findOne({ userId: ObjectId(userId) })
    client.close();
    return userAccount;
}
const updateBalance = async(userId, newBalance) => {
    await client.connect();
    await db.collection(collectionName).updateMany({ userId: ObjectId(userId) }, {
        $set: {
            "balance": `${newBalance} ETB`
        }
    });
    await client.close();

}
module.exports = { getUserAccount, updateBalance }