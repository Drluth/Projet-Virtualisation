const router = require("express").Router();
const { User } = require('../sequelize');
const { OTP } = require('../sequelize');
const { encode } = require("../middlewares/crypt");
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const fs = require('fs').promises;
const path = require('path');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');
const { verify } = require("crypto");

require('dotenv').config();

router.get('/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal server error');
    }
});

async function hashPassword(password) {
    try {
        const saltRounds = 10; // Nombre de tours de salage
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error('Erreur lors du hachage du mot de passe :', error);
        throw error;
    }
}



router.post('/users/add', async (req, res) => {
    try {
        const { fullname, email, password, phoneNumber, fileUpload, photo } = req.body;

        // Créer un nouvel utilisateur
        const newUser = await createUser({ fullname, email, password, phoneNumber, fileUpload, photo });

        // Générer et envoyer l'OTP
        const otpDetails = await generateAndSendOTP(email, newUser);

        // Répondre avec les détails nécessaires
        const response = {
            newUser,
            otpDetails
        };
        res.status(200).json(response);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Internal server error');
    }
});

async function createUser(userData) {
    return await User.create(userData);
}

async function generateAndSendOTP(email, user) {
    const otp = otpGenerator.generate(6, { alphabets: false, upperCase: false, specialChars: false });
    const now = new Date();
    const expirationTime = addMinutesToDate(now, 12);
    const otpInstance = await createOTP(otp, user.id, expirationTime);

    const subjectEmail = 'Activate your account';
    const fullNameUpperCase = user.fullname.toUpperCase();
    const bodyEmail = `Hello ${fullNameUpperCase},\n\nYour new OTP confirm to enable your account is: ${otp}`;
    await sendEmail(email, subjectEmail, bodyEmail);

    return {
        timestamp: now,
        check: email,
        success: true,
        message: 'OTP active account sent to user',
        otp_id: otpInstance.id,
        userId: user.id
    };
}



router.post('/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            return res.status(400).send('Email or phoneNumber must be provided');
        }
        const user = await User.findOne({ where: { email, password, status: 1 } });
        if (user) {
            const token = jwt.sign({ userId: user.id }, process.env.CRYPT_PASSWORD, { expiresIn: '1h' });
            res.status(200).json({ token, user });
        } else {
            res.status(401).send('Invalid email or password or your account is not activate');
        }
    } catch (error) {
        console.error('Error retrieving user data:', error);
        res.status(500).send('Internal server error');
    }
});

async function sendEmail(toEmail, subjectEmail, bodyEmail) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        const mailOptions = {
            from: {
                name: process.env.EMAIL_AUTHOR,
                address: process.env.EMAIL_ADDRESS
            },
            to: toEmail,
            subject: subjectEmail,
            text: bodyEmail,
        };
        await transporter.sendMail(mailOptions);
        console.log('L\'e-mail a été envoyé avec succès');
        return true;
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'e-mail:', error);
        return false;
    }
}

function addMinutesToDate(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}

async function createOTP(otp, userId, expirationTime) {
    return await OTP.create({
        otp,
        userId,
        expiration_time: expirationTime
    });
}



router.post('/users/active_account', async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).send('Email and OTP are required');
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).send('User not found');
        }

        const optData = await OTP.findOne({
            where: {
                otp,
                userId: user.id,
                verified: 0,
            },
            order: [['id', 'DESC']],
            limit: 1
        });



        if (optData) {
            await Promise.all([
                OTP.update({ verified: 1 }, {
                    where: {
                        otp,
                        userId: user.id,
                        verified: 0,
                    }
                }),
                User.update({ status: 1 }, {
                    where: {
                        id: user.id
                    }
                })
            ]);
        } else {
            return res.status(404).send('OTP not found or already verified');
        }

        const subjectEmail = 'Account activate';
        const fullNameUpperCase = user.fullname.toUpperCase();
        const bodyEmail = `Hello ${fullNameUpperCase},\n\nYour account is ready activated`;
        await sendEmail(email, subjectEmail, bodyEmail);
        res.status(200).send('Account activated successfully');
    } catch (error) {
        console.error('Error activating account:', error);
        res.status(500).send('Internal server error');
    }
});






router.post('/users/forgot_password', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).send('Email is required');
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            console.log('User not found');
            return res.status(404).send('User not found');
        }

        // Générer un mot de passe aléatoire de 10 caractères
        const newPassword = Math.random().toString(36).slice(-10);

        // Mettre à jour le mot de passe de l'utilisateur
        user.password = newPassword;
        await user.save();

        // Envoyer le nouveau mot de passe à l'utilisateur par email ou autre moyen de communication sécurisé
        const subjectEmail = 'Reset forgot Password';
        const fullNameUpperCase = user.fullname.toUpperCase();
        const bodyEmail = `Hello ${fullNameUpperCase},\n\nYour new password is : ${newPassword}`;
        await sendEmail(email, subjectEmail, bodyEmail);


        res.status(200).json(user);
    } catch (error) {
        console.error('Error updating password:', error);
        return res.status(500).send('Internal server error');
    }
});








router.post('/users/change_password', async (req, res) => {
    try {
        const { email, newpassword, oldpassword } = req.body;
        if (!email || !oldpassword || !newpassword) {
            return res.status(400).send('all data is required');
        }

        const user = await User.findOne({ where: { email, password: oldpassword } });
        if (!user) {
            console.log('User not found');
            return res.status(404).send('User not found');
        }
        

        // Mettre à jour le mot de passe de l'utilisateur
        user.password = newpassword;
        await user.save();

        // Envoyer le nouveau mot de passe à l'utilisateur par email ou autre moyen de communication sécurisé
        const subjectEmail = 'Change Password';
        const fullNameUpperCase = user.fullname.toUpperCase();
        const bodyEmail = `Hello ${fullNameUpperCase},\n\Congratulation you have good change your password \nThe new password is : ${newpassword}`;
        await sendEmail(email, subjectEmail, bodyEmail);
        res.status(200).json(user);
    } catch (error) {
        console.error('Error updating password:', error);
        return res.status(500).send('Internal server error');
    }

});




module.exports = router;
