import {loginService, signupService, updateProfileService} from "../services/auth.service.js";

export const signupController = (req, res, next) => signupService(req, res, next);

export const loginController = (req, res, next) => loginService(req, res, next);

export const updateProfileController = (req, res, next) => updateProfileService(req, res, next);