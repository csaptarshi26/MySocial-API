import express from 'express';
import bcrypt from 'bcrypt';
import UserModel from '../models/User.mjs';
const router = express.Router();

//UPDATE USER
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (error) {
                return res.status(500).json(error);
            }
        }
        try {
            const user = await UserModel.findByIdAndUpdate(req.params.id, {
                $set: req.body
            });
            res.status(200).json("Account has been updated");
        } catch (error) {
            return res.status(500).json(error);
        }
    } else {
        return res.status(403).json("You can update only your account")
    }
})
//DELETE USER
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await UserModel.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted");
        } catch (error) {
            console.log(error)
            return res.status(500).json(error);
        }
    } else {
        return res.status(403).json("You can delete only your account")
    }
})
//GET A USER
router.get("/:id", async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);
        const { password, updatedAt, ...other } = user._doc;
        res.status(200).json(other);
    } catch (error) {
        res.status(500).json(error);
    }
})
//FOLLOW A USER
router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await UserModel.findById(req.params.id);
            const currentUser = await UserModel.findById(req.body.userId);

            if (!user.followers.includes(req.body.userId)) {
                await UserModel.updateOne({ $push: { followers: req.body.userId } });
                await currentUser.updateOne({ $push: { followings: req.params.id } });

                res.status(200).json("User has been followed")
            } else {
                res.status(403).json("You already follow this user")
            }
        } catch (error) {

        }
    } else {
        res.status(403).json("you can't follow yourself");
    }
})
//UN-FOLLOW A USER
router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await UserModel.findById(req.params.id);
            const currentUser = await UserModel.findById(req.body.userId);

            if (user.followers.includes(req.body.userId)) {
                await UserModel.updateOne({ $pull: { followers: req.body.userId } });
                await currentUser.updateOne({ $pull: { followings: req.params.id } });

                res.status(200).json("User has been unfollowed")
            } else {
                res.status(403).json("You don't unfollow this user")
            }
        } catch (error) {

        }
    } else {
        res.status(403).json("you can't unfollow yourself");
    }
})
export default router;
