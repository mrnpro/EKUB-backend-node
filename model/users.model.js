const { MongoClient } = require('mongodb')

const url = process.env.MONGO_URL;
const client = new MongoClient(url);
const dbName = "Ekub";
const db = client.db(dbName);
const collectionName = "users";
const adduser = async(fullname, email, password) => {
    try {
        await client.connect()

        console.log("connected")
        const userAlreadyExists = await db.collection(collectionName).findOne({ email });
        if (userAlreadyExists) {
            console.log("user already axists");
            return "user already exists";

        }
        const result = await db.collection(collectionName).insertOne({
            fullname,
            email,
            password
        });
        client.close();
        return result;
    } catch (e) {
        console.log(e);
    }
}
const getUser = async(email) => {
    await client.connect();
    const user = await db.collection(collectionName).findOne({ email })
    client.close();
    return user;
}

module.exports = { adduser, getUser }