import Destination from '../models/Destination.model.js';

export const queryMiddleware = async (req, res, next) => {
  const { sortBy, search, author } = req.query;
  const { destination } = req.params;
  const query = {};


  if (search) {
    query["title"] = {
      $regex: new RegExp(`${search}`, "i")
    }
  }

  if (destination) {
    const destinationObject = await Destination.findOne({ name: destination.toLowerCase() });

    if (destinationObject) {
      query["destination"] = destinationObject._id;
    }
  }

  if (author) {
    query["author"] = author;
  }

  let sort = {};

  switch (sortBy) {
    case "oldest" : {
      sort = { createdAt: 1 }
      break;
    }
    case "newest": {
      sort = { createdAt: -1 }
      break;
    }
    case "mostCommented": {
      sort = { commentsCount: -1 }
      break;
    }
    case "leastCommented": {
      sort = { commentsCount: 1 }
      break;
    }
    case "mostViewed": {
      sort = { 'views.count': -1 };
      break;
    }
    case "leastViewed": {
      sort = { 'views.count': 1 };
      break;
    }
    case "mostLiked": {
      sort = { 'likes.count': -1 };
      break;
    }
    case "leastLiked": {
      sort = { 'likes.count': 1 };
      break;
    }
    default: {
      sort = { createdAt: -1 }
    }
  }

  req.searchQuery = query;
  req.sortBy = sort;
  next();
}
