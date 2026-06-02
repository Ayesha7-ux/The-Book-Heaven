# The Book Heaven

The Book Heaven is a premium, full-stack eLibrary platform designed for a superior reading experience. It features a modern aesthetic, robust authentication, role-based access control, and an integrated PDF reader.

## 🚀 Features

- **Modern UI/UX:** Clean, professional "digital library" theme with soft colors and elegant typography.
- **Dark/Light Mode:** Persistent theme toggling for reading comfort.
- **Full-Stack Auth:** Secure JWT-based authentication with Guest, User, and Admin roles.
- **Book Catalog:** Browse by category, search by title/author, and filter by free/premium status.
- **Integrated PDF Reader:** High-quality reading experience directly in the browser using `react-pdf`.
- **Admin Panel:** Secure dashboard for library management, including book uploads (via Cloudinary) and analytics.
- **Premium System:** Simulated payment flow to unlock exclusive content.

## 🛠 Tech Stack

- **Frontend/Backend:** Next.js 15+ (App Router)
- **Database:** MongoDB (Mongoose)
- **Authentication:** Custom JWT with HttpOnly Cookies
- **Styling:** CSS Modules
- **Asset Storage:** Cloudinary (Signed Uploads)
- **Icons:** Lucide React

## 📦 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Cloudinary account

### 2. Environment Variables
Create a `.env.local` file in the root directory and add the following:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### 3. Installation
```bash
npm install
```

### 4. Running the App
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🛡 Security Note
This application uses signed uploads for Cloudinary and HttpOnly cookies for JWT to follow production-grade security standards.

## 📄 License
MIT
