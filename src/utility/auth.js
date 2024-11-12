export const createUserPayload = (user, accessToken) => {
    return {
        _id: user._id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        accessToken
    }
}