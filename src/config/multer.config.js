import multer from "multer";

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "");
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + file.originalname);
//     }
// })

const upload = multer({storage: multer.memoryStorage()});

export default upload;