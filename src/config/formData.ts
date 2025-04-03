import multer from 'multer';
import path from 'path';

// Cấu hình lưu file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Lưu ảnh vào thư mục "uploads/"
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Lấy đuôi file (ví dụ: .png, .jpg)
    const filename = `${Date.now()}-${file.fieldname}${ext}`; // Đặt tên file mới
    cb(null, filename);
  },
});

// Chỉ cho phép upload file ảnh
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'));
    }
    cb(null, true);
  },
});

export default upload;
