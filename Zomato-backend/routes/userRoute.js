const {User} = require('../models/userSchema');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//router.use(bcrypt);

router.post('/signup', async (req, res) => {
    console.log(req.body);
    // if username exists ....
    bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(req.body.password, salt, async function (err, hash) {
            if (err) {
                console.error("Error hashing password:", err);
                return res.status(500).send({
                    'status': 500,
                    'message': 'Internal server error',
                });
            }

            try {
                const result = await User.create({ ...req.body, 'password': hash });
                res.status(200).send({
                    'status': 200,
                    'message': 'User item added successfully',
                    'data': result // Optionally, you can send back the created user data
                });
            } catch (error) {
                console.error("Error inserting user:", error);
                return res.status(500).send({
                    'status': 500,
                    'message': 'Error inserting user',
                });
            }
        });
    });
});



router.post('/login', async (req, res) => {
    let result;
    let user = await User.find({ 'username': req.body.username }).limit(1);
    console.log(user)
    user= Object.keys(user).map((key) => [key, user[key]]);

    if (user) {
        bcrypt.compare(req.body.password, user[0].password, function (err, result) {
            if (result) {

                const tokenSignature = {
                                    'userDetails':{
                                        'firstName':user[0].username,
                                        'lastName':user[0].username,
                                        'userName':user[0].username,
                                        'email':user[0].username,
                                    },
                                    'authorizationDetails':{
                                            'routes': ['resturantList', 'addResturant','addFilters'] 
                                    }
                }
                const token = jwt.sign(tokenSignature, 'secret');
                console.log(token)
                result = {
                    'status': 200,
                    'data': {
                        'token': token
                    },

                }
                res.send({ ...result })
            } else {
                result = {
                    'status': 401,
                    'data': 'Passwword mismatch'
                }
                res.send({ ...result })
            }
        });

    } else {
        result = {
            'status':401,
            'data': 'No user found'
        }
        res.send({ ...result })
    }
});


module.exports=router;
