const { getUser } = require('../../model/users.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const login = async(req, res) => {
    const authheader = req.headers.auth;
    console.log(req.body.username);
    if (authheader) {

        jwt.verify(authheader, process.env.JWT_SECRET, (error, user) => {
            if (error) {

                return res.status(400).send({ "msg": "authorization failed" })
            }
            console.log("authorized with header", authheader);
            return res.status(200).send({ "msg": "login success" });

        });


    } else {

        var { username, password } = req.body;
        const user = await getUser(username);
        if (!username) {
            return res.status(400).send("please enter your username");
        }
        if (!password) {
            return res.status(400).send("please enter your password");
        }
        if (password.length < 4) {
            return res.status(400).send("incorrect use of password");
        }


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
            return res.status(400).send({ msg: "Invalid username or password " })
        }


    }


}

module.exports = login;