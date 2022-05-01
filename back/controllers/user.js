const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/dbConfig');
const fs = require('fs');
require('dotenv').config();

exports.register = (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    db.query(`SELECT * FROM users WHERE email = '${email}' OR username = '${username}'`, (err, result) => {
        if (err) throw err;
        if (result.length < 1) {
            bcrypt.hash(req.body.password, 10)
                .then(hash => {
                    const password = hash;
                    const profileImage = req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : 'https://www.transparentpng.com/thumb/user/blue-male-user-profile-transparent-png-2lbgMx.png'
                    db.query("INSERT INTO users (username, email, password, profileImage) VALUES (?, ?, ?, ?)", [username, email, password, profileImage], (err, results) => {
                        if (err) {
                            res.status(404).json({ message: err })
                        } else {
                            res.status(201).json(results);
                        }
                    })
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({ error })
                })
        } else {
            res.status(400).json({ error: 'Les credentielles que vous viendrez de rentrer existent déjà !' })
        }
    })
}

exports.login = (req, res) => {
    const email = req.body.email;
    db.query("SELECT * FROM users WHERE email = ?", email, (err, results) => {
        if (err) {
            console.log(err);
            res.send({ err: err })
        }
        if (results.length > 0) {
            const user = results[0];
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        res.status(401).json({ error: 'La combination email/mot de passe est incorrecte !' })
                    } else {
                        res.status(200).json({
                            userId: user.id,
                            admin: user.admin,
                            token: jwt.sign(
                                { userId: user.id },
                                process.env.MY_WEIRD_TOKEN,
                                { expiresIn: '24h' }
                            )
                        });
                    }
                })
                .catch(err => res.status(500).json({ err }));
        } else {
            res.status(404).json({ error: 'L\'utilisateur n\'existe pas !' })
        }
    })
}

exports.findOneUser = (req, res) => {
    const userId = req.params.id
    db.query('SELECT * FROM users WHERE id = ?', id = userId, (err, results) => {
        if (err) {
            console.log(err);
            res.send({ err: err })
        }
        if (results.length > 0) {
            const user = results[0]
            res.status(200).send(user);
        }
    })
}

exports.updateUser = (req, res) => {
    const userId = req.auth.userId;
    db.query(`SELECT * FROM users WHERE id = ${userId}`, (err, users) => {
        if (err) {
            console.log(err);
            res.status(404).json({ error: "User not found !" })
        } else {
            const username = req.body.username ? req.body.username : users[0].username;
            const email = req.body.email ? req.body.email : users[0].email;
            const profileImage = req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : users[0].profileImage;

            if (req.file) {
                db.query(`UPDATE users SET profileImage = "${profileImage}" WHERE id = ${userId}`, (err, result) => {
                    if (err) throw err;
                    if (users[0].profileImage !== 'https://www.transparentpng.com/thumb/user/blue-male-user-profile-transparent-png-2lbgMx.png') {
                        fs.unlink(`images/${users[0].profileImage.split('/images/')[1]}`, (err => {
                            if (err) {
                                console.log(err);
                            }
                        }))
                    }
                })
            }

            if (req.body.email && req.body.username) {
                let validEmail = new RegExp("^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$", 'g');

                if (!validEmail.test(email)) {
                    return res.status(400).json({ error: "Email invalide" })
                } else {
                    db.query(`SELECT * FROM users WHERE email = '${email}' OR username = '${username}'`, (err, result) => {
                        if (err) throw err;
                        if (result.length < 1) {
                            db.query(`UPDATE users SET username = "${username}", email = "${email}", profileImage = "${profileImage}" WHERE id = ${userId}`, (err, updatedUser) => {
                                if (err) {
                                    console.log(err);
                                    res.status(500).json({ error: "Couldn't update user !" })
                                }
                                res.status(200).json(users)
                            })
                        } else {
                            res.status(400).json({ error: 'Les credentielles que vous viendrez de rentrer existent déjà !' })
                        }
                    })
                }
            } else if (req.body.email && !req.body.username) {
                let validEmail = new RegExp("^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$", 'g');

                if (!validEmail.test(email)) {
                    return res.status(400).json({ error: "Email invalide" })
                } else {
                    db.query(`SELECT * FROM users WHERE email = '${email}'`, (err, result) => {
                        if (err) throw err;
                        if (result.length < 1) {
                            db.query(`UPDATE users SET username = "${username}", email = "${email}", profileImage = "${profileImage}" WHERE id = ${userId}`, (err, updatedUser) => {
                                if (err) {
                                    console.log(err);
                                    res.status(500).json({ error: "Couldn't update user !" })
                                }
                                res.status(200).json(users)
                            })
                        } else {
                            res.status(400).json({ error: 'L\'email que vous viendrez de rentrer existent déjà !' })
                        }
                    })
                }
            } else if (req.body.username && !req.body.email) {
                db.query(`SELECT * FROM users WHERE username = '${username}'`, (err, result) => {
                    if (err) throw err;
                    if (result.length < 1) {
                        db.query(`UPDATE users SET username = "${username}", email = "${email}", profileImage = "${profileImage}" WHERE id = ${userId}`, (err, updatedUser) => {
                            if (err) {
                                console.log(err);
                                res.status(500).json({ error: "Couldn't update user !" })
                            }
                            res.status(200).json(users)
                        })
                    } else {
                        res.status(400).json({ error: 'Le pseudonyme que vous viendrez de rentrer existe déjà !' })
                    }
                })
            }
        }
    })
}

exports.deleteUser = (req, res) => {
    const userId = req.auth.userId;
    const password = req.body.password;
    db.query(`SELECT * FROM users WHERE id = ${userId}`, (err, users) => {
        if (err) {
            console.log(err);
            res.status(404).json({ error: "Couldn't find user !" })
        }
        const user = users[0];
        bcrypt.compare(password, user.password)
            .then((valid) => {
                if (!valid) {
                    return res.status(401).json({ error: "You're not allowed to make this request, please don't try to access a user other than your own !" })
                }
                db.query(`DELETE FROM users WHERE id = ${userId}`, (err, success) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({ error: "Couldn't delete user !" })
                        return
                    }
                    db.query(`DELETE FROM posts WHERE userId = ${userId}`, (err, success) => {
                        if (err) {
                            console.log(err);
                            res.status(500).json({ error: "Couldn't delete posts related to this user !" })
                        }
                        db.query(`DELETE FROM comments WHERE userId = ${userId}`, (err, success) => {
                            if (err) {
                                console.log(err);
                                res.status(500).json({ error: "Couldn't delete this user's comments !" })
                            } else {
                                res.status(200).json({ message: "This user's comments were deleted successfully !" })
                            }
                        })
                    })
                })
            })
    })
}
