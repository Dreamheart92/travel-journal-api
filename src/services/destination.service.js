import {customResponse} from "../utility/index.js";
import cloudinary from "../config/cloudinary.config.js";
import Destination from "../models/Destination.model.js";
import Journal from "../models/Journal.model.js";

export const createDestinationService = async (req, res, next) => {
    const {name, description} = req.body;

    if (!req.file) {
        return res.status(409).send(customResponse({
            success: false,
            message: "Please provide a image"
        }))
    }

    try {
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

                const destination = await Destination.create({
                    name,
                    description,
                    imageUrl: result.secure_url,
                })

                res.status(201).send(customResponse({
                    success: true,
                    message: null,
                    data: destination
                }))
            }
        );

        uploadImageStream.end(req.file.buffer);


    } catch (error) {
        next(error);
    }
}

export const getDestinationsService = async (req, res, next) => {
    try {
        const destinations = await Destination.find({});
        res.send(customResponse({
            success: true,
            message: null,
            data: destinations
        }))
    } catch (error) {
        next(error);
    }
}