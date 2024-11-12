import {
  deleteJournalService,
  getJournalsService,
  getJournalService,
  createJournalService,
  updateJournalService,
  getUserJournalsService,
  registerJournalViewService, likeJournalService,
} from "../services/journal.service.js";

export const getJournalsController = (req, res, next) => getJournalsService(req, res, next);

export const getJournalController = (req, res, next) => getJournalService(req, res, next);

export const createJournalController = (req, res, next) => createJournalService(req, res, next);

export const updateJournalController = (req, res, next) => updateJournalService(req, res, next);

export const deleteJournalController = (req, res, next) => deleteJournalService(req, res, next);

export const getUserJournalsController = (req, res, next) => getUserJournalsService(req, res, next);

export const registerJournalViewController = (req, res, next) => registerJournalViewService(req, res, next);

export const likeJournalController = (req, res, next) => likeJournalService(req, res, next);
