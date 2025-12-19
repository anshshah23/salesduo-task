# Amazon Listing Optimizer

A full-stack web application that uses Google's Gemini AI to optimize Amazon product listings for better visibility, conversion, and SEO.

## 🚀 Features

- **AI-Powered Optimization**: Uses Gemini AI to improve product titles, bullet points, and descriptions
- **Web Scraping**: Automatically fetches product data from Amazon using ASIN
- **Side-by-Side Comparison**: View original and optimized listings simultaneously
- **Keyword Suggestions**: Get 3-5 SEO-optimized keywords for each product
- **History Tracking**: Store and retrieve optimization history for each ASIN
- **Simple & Clean UI**: Built with Tailwind CSS for a modern, responsive design

## 🛠️ Tech Stack

### Backend
- **Node.js** with **TypeScript**
- **Express.js** for REST API
- **MySQL** for data persistence
- **Cheerio** for web scraping
- **Google Gemini AI** for content optimization

### Frontend
- **React** with **TypeScript**
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Axios** for API calls

## 📋 Prerequisites

- Node.js (v18 or higher)
- MySQL (v8 or higher)
- Gemini API Key ([Get it here](https://makersuite.google.com/app/apikey))

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd salesduo-task
```

### 2. Setup Database

```bash
# Login to MySQL
mysql -u root -p

# Create database and tables
mysql -u root -p < database/schema.sql
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your credentials:
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=salesduo_db
# GEMINI_API_KEY=your_gemini_api_key
# PORT=3000
```

### 4. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install
```

## 🏃 Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
# Server runs on http://localhost:3000
```

### Start Frontend

```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

## 📖 Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Enter an Amazon ASIN (e.g., `B0CX59SM8C`)
3. Click "Optimize" button
4. Wait for the scraping and AI optimization to complete
5. View the side-by-side comparison of original and optimized content

## 🎯 AI Optimization Strategy

### Prompt Engineering

The application uses a carefully crafted prompt to guide Gemini AI:

1. **Title Optimization**:
   - Make it keyword-rich and SEO-friendly
   - Keep it under 200 characters
   - Include brand, product type, and key features
   - Follow Amazon best practices

2. **Bullet Points Enhancement**:
   - Create exactly 5 clear, concise points
   - Focus on benefits and features
   - Keep each point between 150-200 characters
   - Start with capital letters

3. **Description Improvement**:
   - Write persuasive, compelling copy
   - Highlight unique selling points
   - Keep it between 200-300 words
   - Ensure compliance with Amazon policies

4. **Keyword Generation**:
   - Suggest 3-5 relevant SEO keywords
   - Based on product details and features

### Why This Approach?

- **Structured JSON Output**: Ensures consistent, parseable responses
- **Contextual Understanding**: Gemini AI analyzes the entire product context
- **Amazon-Specific**: Tailored to Amazon's listing requirements
- **SEO-Focused**: Optimizes for search visibility

## 📊 API Endpoints

### POST `/api/products/optimize`
Scrape and optimize a product listing

**Request:**
```json
{
  "asin": "B0CX59SM8C"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "asin": "B0CX59SM8C",
    "original": {
      "title": "...",
      "bulletPoints": ["...", "..."],
      "description": "...",
      "productDetails": {}
    },
    "optimized": {
      "title": "...",
      "bulletPoints": ["...", "..."],
      "description": "...",
      "keywords": ["...", "..."]
    }
  }
}
```

### GET `/api/products/:asin`
Get stored product data

### GET `/api/products/:asin/history`
Get optimization history for a product

## 🗄️ Database Schema

### `products` Table
- Stores original and optimized product data
- Indexed by ASIN for quick lookups

### `optimization_history` Table
- Tracks all optimization attempts
- Enables temporal analysis of improvements

## Project Structure

- **backend/**: Contains the server-side application
  - **src/**: Source files for the backend
    - **controllers/**: Request handlers (ProductController)
    - **routes/**: API route definitions
    - **services/**: Business logic (ScraperService, GeminiService)
    - **config/**: Database configuration
    - **types/**: TypeScript type definitions
  - **package.json**: Backend dependencies
  - **tsconfig.json**: TypeScript configuration

- **frontend/**: Contains the client-side application
  - **src/**: Source files for the frontend
    - **App.tsx**: Main application component
    - **services/**: API service layer
    - **types/**: TypeScript interfaces
  - **package.json**: Frontend dependencies
  - **tailwind.config.js**: Tailwind CSS configuration
  - **vite.config.ts**: Vite build configuration

- **database/**: SQL schema files
  - **schema.sql**: Database table definitions

## 🔐 Security Considerations

- API keys stored in environment variables
- Input validation for ASIN format
- Rate limiting recommended for production
- CORS enabled for local development

## 🚧 Known Limitations

- Amazon may block frequent scraping attempts
- Gemini AI responses may vary in quality
- Some products may have incomplete data
- User-Agent rotation may be needed for production

## 🔮 Future Enhancements

- [ ] A/B testing of optimized vs original listings
- [ ] Batch processing of multiple ASINs
- [ ] Export to CSV/PDF
- [ ] Performance metrics dashboard
- [ ] Multi-language support
- [ ] Image optimization suggestions

## 📝 License

MIT License

## 🙏 Acknowledgments

- Google Gemini AI for content optimization
- Amazon for product data
- Open source community for amazing tools