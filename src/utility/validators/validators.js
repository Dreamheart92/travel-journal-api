export const requiredValidation = (value) => {
    if (typeof value === "number") {
        return value?.toString()?.trim() !== "";
    }
    return value?.trim() !== "" || false;
}

export const typeValidation = (value, valueType) => {
    if (valueType === "string") {
        return typeof value === "string";
    }

    if (valueType === "number") {
        return typeof value === "number";
    }
}

export const minLengthValidation = (value, minLength) => {
    if (typeof value === "number") {
        return value?.toString()?.length >= minLength || false;
    }

    return value?.length >= minLength || false;
}