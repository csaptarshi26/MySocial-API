import express from "express";
import mongoose from "mongoose";
import dotEnv from "dotEnv";
import helmet from "helmet";
import morgan from 'morgan';
import userRouter from "./routes/users.mjs";
import authRouter from "./routes/auth.mjs";
import postRouter from "./routes/posts.mjs";


dotEnv.config();
const app = express();

mongoose.connect(process.env.MONGO_URL,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
	() => print("connected to mongo db"))

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);





app.listen(8800, () => print("backend server is running"))


function print(msg) {
	console.log(msg)
}