const {User} = require('../models/userSchema');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
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
    try {
        const user = await User.findOne({ 'username': req.body.username });

        if (!user) {
            return res.status(401).json({ 'error': 'No user found' });
        }

        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err || !result) {
                return res.status(401).json({ 'error': 'Password mismatch' });
            }

            const tokenSignature = {
                'userDetails': {
                    'username': user.username,
                    // Add other user details as needed
                },
                'authorizationDetails': {
                    'routes': ['resturantList', 'addResturant', 'addFilters'] 
                }
            };
            
            const token = jwt.sign(tokenSignature, 'secret', { expiresIn: '1h' }); // Token expires in 1 hour
            
            res.status(200).json({ 'token': token });
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 'error': 'Internal server error' });
    }
});


module.exports=router;
