# 🎬 Movres - Movie Recommendation System
![Screenshot (191)](https://github.com/user-attachments/assets/db5c7686-4f7b-4a1b-91a7-24f00ff6786c)
![Screenshot (192)](https://github.com/user-attachments/assets/52bc7e8f-7535-423f-b4e0-be63c1fe7f85)
![Screenshot (193)](https://github.com/user-attachments/assets/29aa861a-88aa-4fd6-a8f2-e162d56eb53d)


A modern web application that helps users discover movies based on their preferences, featuring a beautiful UI and comprehensive filtering options.

## 🌟 Features

### For Users
- **Smart Movie Discovery**
  - Browse through a vast collection of movies
  - Get personalized recommendations
  - View detailed movie information including cast, director, and ratings

- **Advanced Filtering**
  - Filter by year range (1950-2025)
  - Filter by director and actors
  - Filter by genres
  - Filter by language
  - Sort by popularity, rating, and release date

- **Streaming Information**
  - See where movies are available to stream in India
  - Platform icons for Netflix, Amazon Prime, Disney+, and more
  - Real-time availability updates

- **User Experience**
  - Responsive design for all devices
  - Infinite scroll for seamless browsing
  - Beautiful hover effects and animations
  - Dark mode support

### For Admins
- **User Management Dashboard**
  - View all registered users
  - Manage user roles
  - Ban/unban users
  - Delete user accounts
 
### Project Structure 

Directory structure:
└── abhi-jithb-movierecommendationsystem/
    ├── README.md              # Project documentation
    ├── eslint.config.js       # ESLint configuration
    ├── index.html             # Entry HTML file
    ├── package.json           # Project dependencies and scripts
    ├── postcss.config.js      # PostCSS configuration for Tailwind
    ├── render.yaml            # Render deployment configuration
    ├── tailwind.config.js     # Tailwind CSS configuration
    ├── tsconfig.json          # TypeScript configuration
    ├── vite.config.ts         # Vite build configuration
    └── src/                   # Source code
        ├── App.tsx            # Main application component
        ├── index.css          # Global CSS
        ├── main.tsx           # Application entry point
        ├── components/        # Reusable UI components
        │   ├── FilterBar.tsx  # Movie filtering component
        │   ├── MovieCard.tsx  # Movie presentation card
        │   ├── MovieDetails.tsx # Detailed movie information
        │   ├── Navbar.tsx     # Navigation component
        │   ├── AuthModal.tsx  # Authentication modal
        │   └── ui/            # Base UI components
        │       ├── Button.tsx # Button component
        │       └── Input.tsx  # Input component
        ├── contexts/          # React contexts
        │   └── AuthContext.tsx # Authentication context
        ├── lib/               # Utility functions and services
        │   ├── firebase.ts    # Firebase client configuration
        │   ├── tmdb.ts        # TMDB API service
        │   └── utils.ts       # Helper functions
        ├── pages/             # Page components
        │   ├── Home.tsx       # Home page
        │   ├── MovieDetails.tsx # Movie details page
        │   └── Profile.tsx    # User profile page
        └── types/             # TypeScript type definitions
            ├── movie.ts       # Movie-related types
            └── user.ts        # User-related types

## 🛠️ Tech Stack

- **Frontend**
  - React with TypeScript
  - Tailwind CSS for styling
  - React Router for navigation
  - Firebase Authentication
  - Firebase Firestore

- **APIs**
  - TMDB (The Movie Database) API
  - Firebase APIs

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- TMDB API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/movres.git
cd movres
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory
```env
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

## 📱 Features in Detail

### Movie Cards
- Beautiful poster display
- Hover effects with movie details
- Streaming platform availability
- Director and main cast information
- Year and rating display

### Filter System
- Year range selection (1950-2025)
- Director search with autocomplete
- Actor search with autocomplete
- Genre selection
- Language filter
- Rating filter

### Admin Dashboard
- User list with search
- User role management
- Ban/unban functionality
- User deletion
- Activity monitoring

## 🔒 Security Features

- Firebase Authentication
- Role-based access control
- Secure API key handling
- Protected admin routes

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for providing the movie data
- [Firebase](https://firebase.google.com/) for authentication and database
- [Tailwind CSS](https://tailwindcss.com/) for the styling system
- [React](https://reactjs.org/) for the frontend framework

## 📞 Support
[Linkedin](https://linkedin.com/in/abhi-jithb) 


---

Made with ❤️ by [Abhijith B](https://linkedin.com/in/abhi-jithb) 
