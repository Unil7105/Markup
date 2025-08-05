# MarkHub - Markdown File Management System

A full-stack web application for managing and viewing markdown files with authentication, file uploads, and a beautiful markdown preview interface.

## 🚀 Features

- **🔐 Authentication System**
  - User signup with email verification
  - JWT-based authentication
  - Password reset functionality
  - Protected routes

- **📁 File Management**
  - Upload markdown files
  - List all uploaded files
  - View formatted markdown content
  - Responsive file browser interface

- **🎨 Rich Markdown Preview**
  - GitHub-style markdown rendering
  - Syntax highlighting for code blocks
  - Table support
  - Mobile-responsive design

## 🛠️ Tech Stack

### Frontend
- React.js with Vite
- TailwindCSS for styling
- React Router for navigation
- Axios for API calls
- React Markdown for rendering
- Syntax highlighting with Prism

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- Nodemailer for email services

## 🔧 Setup and Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Git

### Backend Setup
```bash
# Clone the repository
git clone <repository-url>

# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file and add following variables
PORT=3000
MONGODB_URL=your_mongodb_url
JWT_SECRET_KEY=your_jwt_secret

# Start the server
npm start
```

### Frontend Setup
```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Create .env file and add
VITE_API_URL=http://localhost:3000

# Start the development server
npm run dev
```

## 📱 Usage

1. **Authentication**
   - Register with email verification
   - Login with credentials
   - Reset password if forgotten

2. **File Management**
   - Click "Upload File" to add new markdown files
   - View all files in the sidebar
   - Click on any file to preview its content

3. **Markdown Preview**
   - Real-time markdown rendering
   - Code syntax highlighting
   - Mobile-responsive layout
   - GitHub-style formatting

## 🔒 Security Features

- HttpOnly cookies for JWT storage
- Password hashing with bcrypt
- Protected API routes
- CORS configuration
- Email verification
- JWT expiration

## 📝 API Endpoints

### Authentication
- `POST /signup` - Register new user
- `POST /login` - User login
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password with token

### File Management
- `GET /file` - Get all user files
- `POST /upload` - Upload new file
- `GET /md` - Get markdown file content

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



