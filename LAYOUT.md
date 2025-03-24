Service-Repository Pattern

📦 project-root/
 ┣ 📂 src/
 ┃ ┣ 📂 config/          # Cấu hình hệ thống (DB, env, logger)
 ┃ ┃ ┣ 📜 database.ts    # Kết nối DB (MongoDB / MySQL / PostgreSQL)
 ┃ ┃ ┣ 📜 env.ts         # Load biến môi trường từ .env
 ┃ ┃ ┗ 📜 logger.ts      # Cấu hình logger (Winston / Pino)
 ┃ ┣ 📂 modules/         # Các module chính trong hệ thống
 ┃ ┃ ┣ 📂 blog/          # Module Blog
 ┃ ┃ ┃ ┣ 📜 blog.controller.ts   # Xử lý request từ client
 ┃ ┃ ┃ ┣ 📜 blog.service.ts      # Business logic của blog
 ┃ ┃ ┃ ┣ 📜 blog.repository.ts   # Tầng giao tiếp với database
 ┃ ┃ ┃ ┣ 📜 blog.model.ts        # Định nghĩa model/schema
 ┃ ┃ ┃ ┣ 📜 blog.route.ts        # Define routes cho blog
 ┃ ┃ ┃ ┗ 📜 blog.interface.ts    # Định nghĩa types cho blog
 ┃ ┃ ┣ 📂 blogCategory/  # Module Blog Category
 ┃ ┃ ┃ ┣ 📜 blogCategory.controller.ts
 ┃ ┃ ┃ ┣ 📜 blogCategory.service.ts
 ┃ ┃ ┃ ┣ 📜 blogCategory.repository.ts
 ┃ ┃ ┃ ┣ 📜 blogCategory.model.ts
 ┃ ┃ ┃ ┣ 📜 blogCategory.route.ts
 ┃ ┃ ┃ ┗ 📜 blogCategory.interface.ts
 ┃ ┃ ┣ 📂 document/      # Module Document
 ┃ ┃ ┃ ┣ 📜 document.controller.ts
 ┃ ┃ ┃ ┣ 📜 document.service.ts
 ┃ ┃ ┃ ┣ 📜 document.repository.ts
 ┃ ┃ ┃ ┣ 📜 document.model.ts
 ┃ ┃ ┃ ┣ 📜 document.route.ts
 ┃ ┃ ┃ ┗ 📜 document.interface.ts
 ┃ ┃ ┣ 📂 documentCategory/ # Module Document Category
 ┃ ┃ ┃ ┣ 📜 documentCategory.controller.ts
 ┃ ┃ ┃ ┣ 📜 documentCategory.service.ts
 ┃ ┃ ┃ ┣ 📜 documentCategory.repository.ts
 ┃ ┃ ┃ ┣ 📜 documentCategory.model.ts
 ┃ ┃ ┃ ┣ 📜 documentCategory.route.ts
 ┃ ┃ ┃ ┗ 📜 documentCategory.interface.ts
 ┃ ┃ ┣ 📂 contact/       # Module Contact (Liên hệ)
 ┃ ┃ ┃ ┣ 📜 contact.controller.ts
 ┃ ┃ ┃ ┣ 📜 contact.service.ts
 ┃ ┃ ┃ ┣ 📜 contact.repository.ts
 ┃ ┃ ┃ ┣ 📜 contact.model.ts
 ┃ ┃ ┃ ┣ 📜 contact.route.ts
 ┃ ┃ ┃ ┗ 📜 contact.interface.ts
 ┃ ┣ 📂 middlewares/     # Các middleware (validation, error handler)
 ┃ ┃ ┣ 📜 error.middleware.ts    # Middleware xử lý lỗi
 ┃ ┃ ┗ 📜 validate.middleware.ts # Middleware validate input
 ┃ ┣ 📂 utils/           # Các hàm helper chung (format, hash, response)
 ┃ ┣ 📜 app.ts           # Khởi tạo Express App (middleware, routes)
 ┃ ┣ 📜 server.ts        # Chạy server (listen port)
 ┃ ┗ 📜 routes.ts        # Import & tổ chức các routes
 ┣ 📂 tests/             # Thư mục chứa unit tests (Jest / Mocha)
 ┃ ┣ 📜 blog.test.ts     # Test blog module
 ┃ ┣ 📜 document.test.ts # Test document module
 ┃ ┗ 📜 contact.test.ts  # Test contact module
 ┣ 📂 docs/              # API docs (Swagger / Postman Collection)
 ┃ ┗ 📜 api.yaml         # Swagger API spec
 ┣ 📜 .env               # Biến môi trường
 ┣ 📜 .gitignore         # File ignore Git
 ┣ 📜 package.json       # File package JSON
 ┣ 📜 tsconfig.json      # Cấu hình TypeScript
 ┗ 📜 Dockerfile         # Dockerfile build project
