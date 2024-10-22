import multer from "multer";
const allowedImageTypes = /jpg|jpeg|png|webp/;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// File filter to allow only specific image types
const fileFilter = (req, file, cb) => {
  const isImage = allowedImageTypes.test(file.mimetype);
  if (isImage) {
    cb(null, true);
  } else {
    cb(
      new Error("Only .jpg, .jpeg, .png, and .webp formats are allowed!"),
      false
    );
  }
};

export const upload = multer({ storage, fileFilter });
