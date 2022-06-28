const { MongoClient } = require('mongodb')

const url = process.env.MONGO_URL;
const client = new MongoClient(url);
const dbName = "Ekub";
const db = client.db(dbName);
const collectionName = "users";
const adduser = async(fullname, username, password) => {
    try {
        await client.connect()
        const userAlreadyExists = await db.collection(collectionName).findOne({ username });
        if (userAlreadyExists) {
            console.log("user already axists");
            return "user already exists";
        }
        const user = await db.collection(collectionName).insertOne({
            fullname,
            username,
            password
        });


        //get user
        const fetchedUser = await getUser(username);
        if (fetchedUser) {
            await client.connect()
            const userId = fetchedUser._id;
            await db.collection("Accounts").insertOne({
                userId,
                balance: "0",
                package: "none",
                packageStartedOn: "none",
                packageExpireOn: "none"

            })
        }
        client.close();
        return user;
    } catch (e) {
        console.log(e);
    }
}
const getUser = async(username) => {
    await client.connect();
    const user = await db.collection(collectionName).findOne({ username })
    client.close();
    return user;
}

module.exports = { adduser, getUser }