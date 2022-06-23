const { getUser } = require('../../model/users.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const login = async(req, res) => {
    const { email, password } = req.body;
    const user = await getUser(email);
    if (!user) {
        res.status(400).send("Invalid email or password");
    } else if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user._id, email: user.email },
            process.env.JWT_SECRET, { expiresIn: "30d" }
        );

        res.status(200).send({
            token,
            "msg": "login success"
        })

    } else {
        res.status(400).send("")
    }



}

module.exports = login;