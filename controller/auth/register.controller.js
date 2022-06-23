const { adduser } = require('../../model/users.model')
const bcrypt = require('bcrypt');
const register = async(req, res) => {
    const { fullname, email, password } = req.body;
    if (fullname.length < 5) {
        res.status(400).send({
            "msg": "please enter proper name "
        });
    }
    if (password.length < 8) {
        res.status(400).send({
            "msg": "please enter secure password"
        });
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
    const result = await adduser(fullname, email, encryptedPassword)
    res.send(result)
}

module.exports = register;