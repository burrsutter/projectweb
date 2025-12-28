# Pokemon Favorites

A web application to browse, rate, and comment on your favorite Pokemon. Data is sourced from PokeAPI with ratings and comments stored in SQLite.

## Tech Stack

- **Backend:** Node.js + Express
- **Database:** PostgreSQL (pg)
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

3. Set the database connection string:
   ```bash
   export DATABASE_URL="postgres://user:password@localhost:5432/pokemon_favorites"
   ```

4. Open http://localhost:3000 in your browser

For production mode without auto-reload:
```bash
npm start
```

## Deploy to Render.com

### Initial Deployment

1. Push your code to a GitHub repository

2. Log in to [Render](https://render.com) and click **New > Web Service**

3. Connect your GitHub repository

4. Create a Postgres database in Render (**New > PostgreSQL**) and copy its **Internal Database URL**.

5. Configure the web service:
   - **Name:** pokemon-favorites (or your preferred name)
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment Variables:**
     - `DATABASE_URL` = Render Postgres Internal Database URL
     - `NODE_ENV` = `production`

6. Click **Create Web Service**

7. Wait for the build to complete. Your app will be live at `https://your-service-name.onrender.com`

The server creates the required tables on startup.

### Updating Your App

1. Make your changes locally and test with `npm run dev`

2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your update message"
   git push
   ```

3. Render automatically detects the push and redeploys your app

## Render MCP Server

Manage your Render infrastructure directly from Claude Code using the [Render MCP Server](https://render.com/docs/mcp-server).

### Setup

1. Get your API key from [Render Dashboard > Account Settings > API Keys](https://dashboard.render.com/u/settings/api-keys)

2. Add the Render MCP server to Claude Code:
   ```bash
   claude mcp add --transport http render https://mcp.render.com/mcp --header "Authorization: Bearer <YOUR_API_KEY>"
   ```

### What You Can Do

Once configured, you can ask Claude Code to:
- Create and manage web services, static sites, and databases
- Monitor application logs and deployment status
- Check service performance metrics
- Query your Postgres databases
- Troubleshoot issues with natural language
