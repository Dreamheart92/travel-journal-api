import {normalizeValue} from "../utility.js";
import {customResponse} from "../customResponse.js";
import {typeValidation, requiredValidation, minLengthValidation} from "./validators.js";

export const validateData = (...data) => {
    const errors = {};

    data.forEach(field => {
        const fieldName = Object.keys(field)[0];
        const {required, type, value, minLength} = field[fieldName];

        // Check for empty string

        if (required) {
            const isNonEmptyValue = requiredValidation(value);

            if (!isNonEmptyValue) {
                const message = `${normalizeValue(fieldName)} is required`
                addError(fieldName, "required", message, errors);
            }
        }

        // Check for type

        if (type) {
            const isCorrectType = typeValidation(value, type);

            if (!isCorrectType) {
                const message = `Expected type ${type} but received type ${typeof value}`;
                addError(fieldName, "Invalid type", message, errors);
            }
        }

        if (minLength) {
            const isMatchingMinLength = minLengthValidation(value, minLength);

            if (!isMatchingMinLength) {
                const message = `${normalizeValue(fieldName)} must be at least ${minLength} characters long`;
                addError(fieldName, "Invalid length", message, errors);
            }
        }
    })

    return errors;
}

const addError = (fieldName, errorType, message, errors) => {
    let hasError = false;

    return (function () {
        if (!hasError) {
            hasError = true;
            errors.hasError = true;
        }

        if (errors.hasOwnProperty(fieldName)) {
            errors[fieldName].error.push(errorType);
        } else {
            errors[fieldName] = {
                error: [errorType],
                message,
                fieldName
            }
        }

        return errors;
    })();
}

export const handleValidation = (errors, res, next) => {
    if (errors.hasError) {
        delete errors["hasError"];

        res.status(400).send(customResponse({
            success: false,
            message: "Bad request",
            data: errors
        }))
    } else {
        next();
    }
}