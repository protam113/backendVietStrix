import multer from 'multer';

const storage = multer.memoryStorage(); // Lưu vào RAM, không cần lưu file
const upload = multer({ storage });

export default upload;
