# SalesDuo Task

## Overview
SalesDuo is a web application designed to optimize Amazon product listings using an AI model. The application consists of a Node.js backend, a React frontend, and a MySQL database. The backend handles API requests, interacts with the database, and communicates with the AI model to generate optimized product details. The frontend provides a user-friendly interface for inputting ASIN codes and displaying original and optimized product listings.

## Project Structure
```
salesduo-task
├── backend
│   ├── src
│   │   ├── server.ts
│   │   ├── controllers
│   │   │   └── productController.ts
│   │   ├── routes
│   │   │   └── productRoutes.ts
│   │   ├── services
│   │   │   └── geminiService.ts
│   │   ├── models
│   │   │   └── Product.ts
│   │   ├── config
│   │   │   └── database.ts
│   │   └── types
│   │       └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── frontend
│   ├── src
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── components
│   │   │   ├── ASINInput.tsx
│   │   │   ├── OriginalListing.tsx
│   │   │   └── OptimizedListing.tsx
│   │   ├── pages
│   │   │   └── Home.tsx
│   │   ├── services
│   │   │   └── api.ts
│   │   ├── types
│   │   │   └── index.ts
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── README.md
├── database
│   └── schema.sql
└── README.md
```

## Backend Setup
1. Navigate to the `backend` directory.
2. Install dependencies using npm:
   ```
   npm install
   ```
3. Configure the database connection in `src/config/database.ts`.
4. Run the server:
   ```
   npm start
   ```

## Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies using npm:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

## Database Setup
1. Use the `schema.sql` file in the `database` directory to set up the MySQL database.
2. Ensure that the database connection parameters in `backend/src/config/database.ts` match your MySQL setup.

## Project Goals
- To provide a seamless experience for Amazon sellers to optimize their product listings.
- To leverage AI technology for generating optimized titles, descriptions, and keywords.
- To maintain a clean and modular codebase for easy maintenance and scalability.

## Architecture
- **Backend**: Built with Node.js and Express, handling API requests and database interactions.
- **Frontend**: Developed using React, providing a responsive user interface.
- **Database**: MySQL is used for storing product details and optimization history.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.