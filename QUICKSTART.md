# Quick Start Guide

## Environment Setup

### 1. Create Backend .env File

Create `backend/.env` with:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=salesduo_db
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Setup MySQL Database

```bash
# Login to MySQL
mysql -u root -p

# Run the schema
source database/schema.sql
```

Or manually:

```bash
mysql -u root -p < database/schema.sql
```

### 3. Get Gemini API Key

1. Visit https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Create a new API key
4. Copy it to your `.env` file

## Running the Application

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

Backend will run on http://localhost:3000

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

Frontend will run on http://localhost:5173

## Testing the Application

1. Open http://localhost:5173 in your browser
2. Enter an Amazon ASIN (example: `B0CX59SM8C`)
3. Click "Optimize"
4. View the results!

## Example ASINs to Test

- `B0CX59SM8C` - Lymio Jacket
- `B07VGRJDFY` - Fire TV Stick
- `B08C1W5N87` - Echo Dot

## Troubleshooting

### Database Connection Failed
- Check MySQL is running: `mysql -u root -p`
- Verify credentials in `.env`
- Ensure database `salesduo_db` exists

### Gemini API Error
- Verify API key is correct
- Check API quota/limits
- Ensure key has proper permissions

### Scraping Fails
- Amazon may block requests
- Try different ASINs
- Check internet connection
- Some products may not have complete data

### Frontend Can't Connect to Backend
- Ensure backend is running on port 3000
- Check CORS settings
- Verify API_BASE_URL in frontend code

## Development Tips

### Backend Hot Reload
The backend uses `nodemon` for auto-restart on file changes.

### Frontend Hot Reload
Vite provides instant HMR (Hot Module Replacement).

### Database Queries
Test queries directly:
```bash
mysql -u root -p salesduo_db
SELECT * FROM products;
```

### API Testing
Use tools like Postman or curl:
```bash
# Test optimization endpoint
curl -X POST http://localhost:3000/api/products/optimize \\
  -H "Content-Type: application/json" \\
  -d '{"asin":"B0CX59SM8C"}'
```

## Next Steps

- Customize Gemini prompts in `backend/src/services/geminiService.ts`
- Modify UI styling in `frontend/src/App.tsx`
- Add more features like export, batch processing, etc.
