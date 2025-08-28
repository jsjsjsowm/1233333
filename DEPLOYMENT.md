# Deployment Guide for Telegram Mini App Roulette

## Overview
This guide covers deploying the Telegram Mini App roulette game to production with Netlify for the frontend and a cloud provider for the backend.

## Prerequisites
- Node.js 18+ installed
- Netlify account
- Backend deployed to a cloud provider (Heroku, Railway, DigitalOcean, etc.)
- Telegram Bot created via @BotFather

## Backend Deployment

### 1. Environment Variables
Set these environment variables on your backend hosting provider:

```env
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key-here
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
NODE_ENV=production
```

### 2. Database Setup
Run Prisma migrations on your production database:

```bash
npx prisma migrate deploy
npx prisma generate
```

## Frontend Deployment to Netlify

### 1. Build Configuration
The project includes a `netlify.toml` file with the following configuration:

```toml
[build]
  base = "frontend"
  command = "npm run build"
  publish = "build"

[[redirects]]
  from = "/api/*"
  to = "https://your-backend-api.herokuapp.com/api/:splat"
  status = 200
  force = true

[build.environment]
  REACT_APP_API_URL = "https://your-backend-api.herokuapp.com"
  REACT_APP_ENVIRONMENT = "production"
```

### 2. Environment Variables Setup
In your Netlify dashboard, set these environment variables:

- `REACT_APP_API_URL`: Your backend API URL (e.g., `https://your-backend-api.herokuapp.com`)
- `REACT_APP_ENVIRONMENT`: Set to `production`

### 3. Deploy Steps

#### Option A: Git-based Deployment (Recommended)
1. Push your code to GitHub/GitLab
2. Connect your repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `frontend/build`
5. Add environment variables in Netlify dashboard
6. Deploy

#### Option B: Manual Deployment
1. Build the frontend locally:
   ```bash
   cd frontend
   npm install
   npm run build
   ```
2. Drag and drop the `build` folder to Netlify

### 4. Update Backend URL
After deploying your backend, update the `netlify.toml` file:

```toml
[[redirects]]
  from = "/api/*"
  to = "https://YOUR-ACTUAL-BACKEND-URL/api/:splat"
  status = 200
  force = true
```

## Telegram Bot Configuration

### 1. Set Bot Commands
Use @BotFather to set these commands:

```
start - Start playing roulette
help - Get help information
```

### 2. Set Menu Button
Configure the menu button to open your Netlify app:

```
/setmenubutton
@YourBotUsername
🎰 Play Roulette
https://your-netlify-app.netlify.app
```

### 3. Configure Web App
Set the web app URL in your bot settings:

```
/newapp
@YourBotUsername
Roulette Game
https://your-netlify-app.netlify.app
```

## Testing Deployment

### 1. Frontend Testing
- ✅ App loads correctly
- ✅ Telegram authentication works
- ✅ API calls reach backend
- ✅ Game functionality works
- ✅ Responsive design on mobile

### 2. Backend Testing
- ✅ Database connections work
- ✅ JWT authentication functions
- ✅ All API endpoints respond
- ✅ CORS configured for frontend domain

### 3. Integration Testing
- ✅ Complete game flow works
- ✅ Balance updates correctly
- ✅ Game history saves
- ✅ Statistics display properly

## Troubleshooting

### Common Issues

#### API Calls Failing
- Check `REACT_APP_API_URL` environment variable
- Verify backend is running and accessible
- Check CORS configuration on backend

#### Telegram Authentication Not Working
- Verify `TELEGRAM_BOT_TOKEN` is correct
- Check bot permissions and settings
- Ensure web app URL is configured correctly

#### Build Failures
- Check Node.js version compatibility
- Verify all dependencies are installed
- Review build logs for specific errors

### Monitoring
- Set up error tracking (Sentry, LogRocket)
- Monitor API response times
- Track user engagement metrics
- Monitor database performance

## Security Considerations

### Production Checklist
- ✅ JWT secrets are secure and unique
- ✅ Database credentials are protected
- ✅ HTTPS enabled on all endpoints
- ✅ CORS properly configured
- ✅ Input validation on all endpoints
- ✅ Rate limiting implemented
- ✅ Error messages don't expose sensitive data

### Telegram Security
- ✅ Validate Telegram data signatures
- ✅ Implement proper session management
- ✅ Secure token storage
- ✅ Regular security audits

## Maintenance

### Regular Tasks
- Monitor error logs
- Update dependencies
- Backup database regularly
- Review security settings
- Monitor performance metrics

### Scaling Considerations
- Database connection pooling
- CDN for static assets
- Load balancing for high traffic
- Caching strategies
- Database optimization

## Support
For issues or questions:
1. Check the troubleshooting section
2. Review application logs
3. Test in development environment
4. Contact development team

---

**Note**: Replace all placeholder URLs and tokens with your actual production values before deployment.
