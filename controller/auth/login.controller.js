const { getUser } = require('../../model/users.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const login = async(req, res) => {
    const authheader = req.headers.auth;

    if (authheader) {

        jwt.verify(authheader, process.env.JWT_SECRET, (error, user) => {
            if (error) {

                return res.status(400).send({ "msg": "authorization failed" })
            }

            return res.status(200).send({ "msg": "login success" });

        });


    } else {

        var { username, password } = req.body;
        const user = await getUser(username);
        if (!user) {
            res.status(400).send("Invalid username or password");
        } else if (await bcrypt.compare(password, user.password)) {
            try {
                const token = jwt.sign({ id: user._id, username: user.username },
                    process.env.JWT_SECRET, { expiresIn: "30d" }
                );
                res.setHeader('Content-Type', 'application/json');
                return res.status(200).send({
                    token,
                    "msg": "login success"
                });
            } catch (e) {
                return res.status(200).send({ msg: e });
            }

        } else {
            return res.status(400).send("Invalid username or password ")
        }


    }


}

module.exports = login;