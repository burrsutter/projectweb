# Pokemon Favorites

A web application to browse, rate, and comment on your favorite Pokemon. Data is sourced from PokeAPI with ratings and comments stored in SQLite.

## Tech Stack

- **Backend:** Node.js + Express
- **Database:** SQLite (better-sqlite3)
- **Frontend:** HTML, CSS, JavaScript, Tailwind CSS (CDN)
- **Data Source:** PokeAPI

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server (with auto-reload):
   ```bash
   npm run dev
   ```

3. Open http://localhost:3000 in your browser

For production mode without auto-reload:
```bash
npm start
```

## Deploy to Render.com

### Initial Deployment

1. Push your code to a GitHub repository

2. Log in to [Render](https://render.com) and click **New > Web Service**

3. Connect your GitHub repository

4. Configure the service:
   - **Name:** pokemon-favorites (or your preferred name)
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

5. Click **Create Web Service**

6. Wait for the build to complete. Your app will be live at `https://your-service-name.onrender.com`

### Updating Your App

1. Make your changes locally and test with `npm run dev`

2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your update message"
   git push
   ```

3. Render automatically detects the push and redeploys your app
