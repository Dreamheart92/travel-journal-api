import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import validationConstants from "../constants/validationConstants.js";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        minLength: [validationConstants.USERNAME_MIN_LENGTH, `Username must be at least ${validationConstants.USERNAME_MIN_LENGTH} characters long`],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        unique: [true, "Email address is already registered"],
        minLength: [validationConstants.EMAIL_MIN_LENGTH, `Email must be at least ${validationConstants.EMAIL_MIN_LENGTH} characters long`],
        match: [/^[a-z0-9]+@[a-z]+[.][a-z]+/, "Email address is invalid"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
        minLength: [validationConstants.PASSWORD_MIN_LENGTH, `Password must be at least ${validationConstants.PASSWORD_MIN_LENGTH} characters long`]
    },
    firstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true,
        minLength: [validationConstants.FIRST_NAME_MIN_LENGTH, `First name must be at least ${validationConstants.FIRST_NAME_MIN_LENGTH} characters long`]
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        trim: true,
        minLength: [validationConstants.LAST_NAME_MIN_LENGTH, `Last name must be at least ${validationConstants.LAST_NAME_MIN_LENGTH} characters long`]
    },
    imageUrl: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
})

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const salt = 10;
        this.password = await bcrypt.hash(this.password, salt);
    }
})

userSchema.methods.createToken = async function () {
    const payload = {
        _id: this._id,
    }
    return jwt.sign(payload, jwtSecret);
}

userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
}

export default mongoose.model("User", userSchema);