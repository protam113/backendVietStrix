### README - Blog Backend API

#### Introduction

This is a backend system for a blog API that provides functionalities for creating blog posts, retrieving a list of blog posts, and fetching detailed information about a specific blog post. This backend uses MongoDB with Docker to run MongoDB in a container. Key API functionalities include creating new blog posts, filtering blog posts by category, pagination, and searching blog posts.

The backend API is built with **Node.js**, **Express**, and uses **MongoDB** for data storage. The API supports categories for blog posts, and each blog post can belong to multiple categories.

---

### Requirements

- **Node.js** (>= 14.x)
- **MongoDB** (installed via Docker)
- **Docker** (to run MongoDB in a container)
- **Yarn** (dependency management)

---

### Setting Up the Environment

1. **Clone the Repository**

   First, clone this repository to your local machine.

   ```bash
   git clone https://github.com/protam113/backendVietStrix.git
   cd backendVietStrix
   ```

2. **Install Dependencies**

   Install the necessary dependencies for the backend using **yarn**:

   ```bash
   yarn install
   ```

3. **Set Up MongoDB Container with Docker**

   To run MongoDB in a Docker container, you need to have Docker installed on your machine. Then, create and run a MongoDB container using the following command:

   ```bash
   cd db
   ```

   ```bash
   docker-compose up -d
   ```

   This command will create and run a MongoDB container with port 27017 exposed, allowing you to connect to MongoDB from the backend.

4. **Configure Environment Variables**

   Create a `.env` file in the root directory of the project and add the following configuration:

   This configuration allows the backend to connect to the MongoDB container via port 27017.

```bash
  nodemon server
```

---

### Key Features

- **Create a Blog Post**: The API allows the creation of a new blog post with details such as title, content, description, and associated categories.
- **List Blog Posts**: The API allows retrieving a list of blog posts with pagination and the ability to filter by categories.
- **Get Blog Post Details**: The API allows fetching detailed information about a specific blog post using the `slug`.
- **Contact Management**: The API allows creating a new contact and retrieving a list of all contacts.
- **Documents and Categories**: The API supports managing documents and their categories, allowing the user to create, list, and filter documents by categories. Categories are not restricted to blog posts only, but can also be applied to other types of documents.

---

### Docker Commands

- **Start MongoDB container:**

  ```bash
  docker run --name mongodb -d -p 27017:27017 mongo
  ```

- **Check MongoDB container status:**

  ```bash
  docker ps
  ```

- **Stop MongoDB container:**

  ```bash
  docker stop mongodb
  ```

---

### Conclusion

This Blog Backend provides a complete RESTful API for managing blog posts and categories. MongoDB is used as the database, with Docker providing a simple and efficient way to deploy and manage the database. Pagination and category filtering functionalities allow users to easily access and search for blog posts.
