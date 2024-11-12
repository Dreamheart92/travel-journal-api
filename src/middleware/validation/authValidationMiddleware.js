import {handleValidation, validateData} from "../../utility/index.js";
import validationConstants from "../../constants/validationConstants.js";

export const loginValidationMiddleware = (req, res, next) => {
    const {email, password} = req.body;

    const errors = validateData(
        {
            email: {
                required: true,
                type: "string",
                value: email,
                minLength: validationConstants.EMAIL_MIN_LENGTH
            },
        },
        {
            password: {
                required: true,
                type: "string",
                value: password,
                minLength: validationConstants.PASSWORD_MIN_LENGTH
            }
        }
    )

    handleValidation(errors, res, next);
}

export const signupValidationMiddleware = (req, res, next) => {
    const {username, email, password} = req.body;

    const errors = validateData(
        {
            username: {
                type: "string",
                required: true,
                value: username,
                minLength: validationConstants.USERNAME_MIN_LENGTH
            }
        },
        {
            email: {
                type: "string",
                required: true,
                value: email,
                minLength: validationConstants.EMAIL_MIN_LENGTH
            }
        },
        {
            password: {
                type: "string",
                required: true,
                value: password,
                minLength: validationConstants.PASSWORD_MIN_LENGTH
            }
        }
    )

    handleValidation(errors, res, next);
}