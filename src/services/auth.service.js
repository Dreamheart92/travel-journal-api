import User from "../models/User.model.js";

import {createUserPayload, customResponse} from "../utility/index.js";
import cloudinary from "../config/cloudinary.config.js";

export const signupService = async (req, res, next) => {
    const {email, username, firstName, lastName, password} = req.body;

    try {
        const isEmailExist = await User.findOne({email});

        if (!isEmailExist) {
            const user = await User.create({email, username, password, firstName, lastName});
            const accessToken = await user.createToken();

            const payload = createUserPayload(user, accessToken);

            res.send(customResponse({
                success: true,
                message: "Signup successful",
                data: payload
            }))
        } else {
            res.status(409).send(customResponse({
                success: false,
                message: "Email address is already registered"
            }))
        }
    } catch (error) {
        next(error);
    }
}

export const loginService = async (req, res, next) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});

        if (!user) {
            res.status(401).send(customResponse({
                success: false,
                message: "Invalid email address or password"
            }))
        } else {
            const isPasswordMatching = await user.comparePassword(password);

            if (isPasswordMatching) {
                const accessToken = await user.createToken();

                const payload = createUserPayload(user, accessToken);
                res.status(200).send(customResponse({
                    success: true,
                    message: "Login successful",
                    data: payload
                }))
            } else {
                res.status(401).send(customResponse({
                    success: false,
                    message: "Invalid email address or password"
                }))
            }
        }

    } catch (error) {
        next(error);
    }
}

export const updateProfileService = async (req, res, next) => {
    const {email, username, firstName, lastName} = req.body;

    const updateUserData = {
        email,
        username,
        firstName,
        lastName,
    }

    try {
        if (req.file) {
            const user = await User.findById(req.userId);

            if (user.imageUrl !== "") {
                const imageUrlToArray = user.imageUrl.split("/");
                const imageToDeleteId = imageUrlToArray[imageUrlToArray.length - 1].split(".")[0];

                await cloudinary.uploader.destroy(imageToDeleteId);
            }

            const uploadImageStream = await cloudinary.uploader.upload_stream(
                {resource_type: 'image'},
                async (error, result) => {
                    if (error) {
                        return res.send(customResponse({
                            success: false,
                            message: "Image upload failed",
                            data: null
                        }))
                    }

                    updateUserData.imageUrl = result.secure_url;

                    const updatedUser = await User.findByIdAndUpdate(req.userId, updateUserData, {new: true});
                    const accessToken = await updatedUser.createToken();
                    const payload = createUserPayload(updatedUser, accessToken);

                    res.send(customResponse({
                        success: true,
                        message: "Updated",
                        data: payload
                    }))

                })

            uploadImageStream.end(req.file.buffer);

        } else {
            const user = await User.findByIdAndUpdate(req.userId, updateUserData, {new: true});
            const accessToken = await user.createToken();
            const payload = createUserPayload(user, accessToken);

            res.send(customResponse({
                success: true,
                message: "Updated",
                data: payload
            }))
        }
    } catch (error) {
        next(error);
    }
}