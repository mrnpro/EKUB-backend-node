const { adduser, getUser } = require('../../model/users.model')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const register = async(req, res) => {
    const { fullname, username, password } = req.body;
    if (!fullname) {
        return res.status(400).send("please enter your fullname");
    }
    if (!username) {
        return res.status(400).send("please enter your username");
    }
    if (!password) {
        return res.status(400).send("please enter your password");
    }
    if (password.length < 4) {
        return res.status(400).send("please enter strong password");
    }
    const encryptedPassword = await bcrypt.hash(password, 10);

    const result = await adduser(fullname, username, encryptedPassword);

    try {
        if (result != "user already exists") {
            const user = await getUser(username)
            if (user) {
                const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "30d" });

                return res.status(200).send({
                    token,
                    "msg": "success"
                })
            }
        }
    } catch (e) {
        return res.status(400).send(e);
    }

    return res.status(400).send(result);
}

module.exports = register;