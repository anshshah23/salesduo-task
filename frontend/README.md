# SalesDuo Task - Frontend

This project is a web application designed to optimize Amazon product listings using an AI model. It consists of a Node.js backend, a React frontend, and a MySQL database.

## Frontend Overview

The frontend is built using React and provides a user-friendly interface for inputting ASIN codes and displaying both original and optimized product listings.

### Project Structure

```
frontend
├── src
│   ├── App.tsx                # Main application component
│   ├── App.css                # Styles for the application
│   ├── components              # Reusable components
│   │   ├── ASINInput.tsx      # Component for ASIN input
│   │   ├── OriginalListing.tsx # Component for displaying original product details
│   │   └── OptimizedListing.tsx# Component for displaying optimized product details
│   ├── pages                  # Page components
│   │   └── Home.tsx          # Main page component
│   ├── services               # API service functions
│   │   └── api.ts            # Functions for making API calls to the backend
│   ├── types                  # TypeScript types and interfaces
│   │   └── index.ts          # Type definitions
│   └── main.tsx              # Entry point of the React application
├── package.json               # NPM configuration for the frontend
└── vite.config.ts            # Vite configuration for the frontend
```

### Getting Started

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd salesduo-task/frontend
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Run the application:**
   ```
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000` to view the application.

### Features

- Input ASIN codes to fetch product details.
- Display original product information.
- Generate and display optimized product listings using an AI model.

### Technologies Used

- **React**: For building the user interface.
- **Vite**: For fast development and build tooling.
- **TypeScript**: For type safety and better development experience.

### Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

### License

This project is licensed under the MIT License. See the LICENSE file for details.