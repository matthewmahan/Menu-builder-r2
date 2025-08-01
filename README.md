# MenuBuilder - Digital Menu Creator for Food Trucks

A full-stack web application that allows food truck owners to easily create, edit, and share digital menus with QR code functionality.

## 🚀 Features

### Core Features
- **User Onboarding**: Step-by-step first-time user flow (Typeform-style)
- **Menu Creation & Editing**: Intuitive drag-and-drop menu editor
- **Real-time Preview**: Live preview of public-facing digital menu
- **QR Code Generation**: High-resolution QR codes with optional branding
- **Mobile-Optimized**: Responsive design for all devices
- **Public Menu View**: Clean, accessible menu pages via QR code or public link

### Advanced Features
- **Open/Closed Toggle**: Schedule support for business hours
- **Offline Mode**: Static version caching when no connection
- **Short URL Generation**: Custom short URLs (e.g., truckmenu.io/thebbqboss)
- **PDF Export**: Printable menu layouts
- **Menu Versioning**: Undo recent changes with version history
- **Analytics**: Track menu views and popular items

## 🛠 Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** authentication
- **Multer** for file uploads
- **Sharp** for image processing
- **QRCode** library for QR generation
- **Puppeteer** for PDF generation

### Frontend
- **React** with React Router
- **Styled Components** for styling
- **Axios** for API calls
- **React Hook Form** for form handling
- **DND Kit** for drag-and-drop functionality
- **React Icons** for UI icons

## 📁 Project Structure

```
menu-builder-r2/
├── server/                 # Backend API
│   ├── config/            # Database configuration
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── uploads/           # File storage
│   └── index.js           # Server entry point
├── client/                # React frontend
│   ├── public/            # Static assets
│   └── src/
│       ├── components/    # Reusable components
│       ├── contexts/      # React contexts
│       ├── pages/         # Page components
│       ├── styles/        # Global styles and theme
│       └── App.js         # Main app component
└── package.json           # Root package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd menu-builder-r2
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   cd server
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/menu-builder
   JWT_SECRET=your-super-secret-jwt-key
   QR_CODE_BASE_URL=http://localhost:3000
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on http://localhost:5000
   - Frontend development server on http://localhost:3000

## 📱 Usage

### For Food Truck Owners

1. **Sign Up**: Create your account with business details
2. **Onboarding**: Complete the 5-step setup process
   - Welcome & business name
   - Add tagline
   - Describe your cuisine
   - Upload logo (optional)
   - Create your first menu
3. **Menu Editor**: Add, edit, and organize your menu items
4. **Generate QR Code**: Create QR codes for customers to scan
5. **Share**: Display QR codes or share public menu links

### For Customers

1. **Scan QR Code**: Use any QR code scanner
2. **View Menu**: Browse the mobile-optimized menu
3. **Check Status**: See if the business is currently open

## 🔧 API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `POST /api/users/verify-token` - Verify JWT token

### Menus
- `GET /api/menus` - Get user's menus
- `POST /api/menus` - Create new menu
- `GET /api/menus/:id` - Get specific menu
- `PUT /api/menus/:id` - Update menu
- `DELETE /api/menus/:id` - Delete menu
- `GET /api/menus/public/:shortUrl` - Get public menu

### Menu Items
- `POST /api/menus/:id/items` - Add menu item
- `PUT /api/menus/:id/items/:itemId` - Update menu item
- `DELETE /api/menus/:id/items/:itemId` - Delete menu item
- `PUT /api/menus/:id/items/reorder` - Reorder menu items

### QR Codes
- `GET /api/qr/:menuId` - Generate QR code
- `POST /api/qr/:menuId/save` - Save QR code
- `GET /api/qr/:menuId/download` - Download QR code

### File Uploads
- `POST /api/upload/logo` - Upload business logo
- `POST /api/upload/menu-item` - Upload menu item image

## 🎨 Design System

The application uses a comprehensive design system with:
- **Color Palette**: Primary blue theme with semantic colors
- **Typography**: Inter font family with consistent sizing
- **Spacing**: 8px base unit system
- **Components**: Reusable styled components
- **Responsive Design**: Mobile-first approach

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation and sanitization
- File upload restrictions
- CORS configuration

## 📊 Database Schema

### User Model
- Authentication details
- Business information
- Onboarding progress
- Subscription status

### Menu Model
- Business details and branding
- Menu items with categories
- Theme customization
- Version history
- Analytics data

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or your preferred database
2. Configure environment variables for production
3. Deploy to your preferred platform (Heroku, DigitalOcean, etc.)

### Frontend Deployment
1. Build the React app: `cd client && npm run build`
2. Deploy to Netlify, Vercel, or serve from your backend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@menubuilder.com or create an issue in the repository.

---

Built with ❤️ for food truck owners who want to go digital.