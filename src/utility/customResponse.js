export const customResponse = ({success, message, data = null}) => {
    return {
        success,
        message,
        data,
    }
}