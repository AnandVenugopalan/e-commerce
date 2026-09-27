# NOVA — E-Commerce Product Management System

A full-stack e-commerce product management application built with React, Tailwind CSS, Node.js, Express.js and MongoDB.

The application provides user authentication and product management functionality through a REST API.

## Features

### Authentication

- User registration
- User login
- JWT-based authentication
- Access token refresh
- Logout
- Protected user profile endpoint
- Backend request validation

### Product Management

- View all products
- View a single product
- Add a product
- Edit a product
- Delete a product
- Product validation
- Product image URL support
- Product sizes
- Stock management

### Frontend

- React
- React Router
- Axios
- Tailwind CSS
- Responsive UI
- Form validation/error handling
- Product management interface

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication
- Express Validator
- REST API

---

## Project Structure

```text
e-commerce/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── validators/
│   ├── utils/
│   ├── app.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   └── package.json
│
└── README.md