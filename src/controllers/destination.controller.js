import {createDestinationService, getDestinationsService} from "../services/destination.service.js";

export const createDestinationController = (req, res, next) => createDestinationService(req, res, next);

export const getDestinationController = (req, res, next) => getDestinationsService(req, res, next);