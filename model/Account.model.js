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
module.exports = { getUserAccount }