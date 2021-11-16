import express from 'express';
import UserModel from '../models/User.mjs';
import bcrypt from 'bcrypt'

const router = express.Router();


//REGISTER
router.post("/register", async (req, res) => {

    try {
        const data = req.body;
        //GENERATE NEW HASHED PASSWORD
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(data.password, salt);

        //CREATE NEW USER
        const new_user = await new UserModel({
            username: data.username,
            email: data.email,
            password: hashedPass
        });

        //SAVE NEW USER
        let user = await new_user.save();
        //RETURN NEW USER
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
})

//LOGIN
router.post("/login", async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });
        !user && res.status(404).json("User not found");

        const validPassword = await bcrypt.compare(req.body.password,user.password);
        !validPassword && res.status(400).json("Wrong password");

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }

})

export default router;
