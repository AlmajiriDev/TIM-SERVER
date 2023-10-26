const multer = require("multer");

//cloudinary

const multerConfig = multer.diskStorage({
 
 filename: (req, file, callback) => {
    const ext = file.mimetype.split("/")[1];
    callback(null, `timsanimg-${Date.now()}.${ext}`);
  },
});
const isImage = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback(new Error("Only Image"));
  }
};
const upload = multer({
  storage: multerConfig,
  limits: { fileSize: "1000000" },
  fileFilter: isImage,
});

exports.uploadImage = upload.single("image");