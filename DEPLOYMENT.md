# Islamic Compass Portal - Deployment Guide

## Custom Domain Setup: myislam.iamfasih.com

This application is a full-stack Express.js application with PostgreSQL database, which requires server-side hosting.

**IMPORTANT:** This is NOT a static site - it requires a Node.js server and PostgreSQL database. Vercel supports this through their serverless functions.

### Deployment Options

#### Option 1: Railway/Render Deployment (Recommended for Production)
**⚠️ Important:** This app uses a long-running Express server with `app.listen()` which requires a platform that supports persistent Node.js processes. Vercel/Netlify serverless functions are NOT compatible without significant refactoring.

**Recommended Platforms:**
- **Railway** (railway.app) - Easy deployment, custom domains, auto-scaling
- **Render** (render.com) - Free tier available, automatic HTTPS
- **Fly.io** - Global edge deployment

**Steps for Railway:**
1. **Prerequisites:**
   - Railway account
   - GitHub repository with your code
   - Neon PostgreSQL database (or use Railway's built-in PostgreSQL)

2. **Deploy:**
   - Connect GitHub repo to Railway
   - Railway auto-detects Node.js and builds
   - Add environment variables in Railway dashboard:
     - `DATABASE_URL`, `SESSION_SECRET`, `OPENAI_API_KEY`
     - `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`
     - `NODE_ENV=production`

3. **Custom Domain:**
   - In Railway settings → Networking → Custom Domain
   - Add `myislam.iamfasih.com`
   - Follow DNS instructions (typically CNAME to your-app.up.railway.app)

**Steps for Render:**
1. Create new "Web Service" in Render dashboard
2. Connect GitHub repo
3. Build Command: `npm install && npm run build`
4. Start Command: `npm start`
5. Add environment variables
6. Custom domain in Settings → Custom Domains

#### Option 2: Replit Deployment (Easiest Setup)
For quick deployment without leaving Replit:

1. **Publish on Replit:**
   - Click the "Publish" button in the Replit interface
   - This will deploy both frontend and backend together
   - The app will be available at `https://<repl-name>.<username>.repl.co`

2. **Add Custom Domain:**
   - Go to your Replit deployment settings
   - Add custom domain: `myislam.iamfasih.com`
   - Replit will provide DNS configuration instructions
   - Update your DNS records at your domain registrar (likely where you bought iamfasih.com):
     - Add CNAME record: `myislam` pointing to your Replit deployment URL
     - Or A record if CNAME is not supported
   - SSL certificate will be automatically provisioned by Replit

#### Option 2: Hybrid Deployment (Advanced)
If you need to separate frontend and backend:

**Backend (Replit):**
- Deploy backend on Replit with database
- Available at: `https://api-<repl-name>.<username>.repl.co`

**Frontend (Netlify/Vercel):**
- Build static frontend: `npm run build`
- Deploy `dist` folder to Netlify
- Set environment variable: `VITE_API_URL=<replit-backend-url>`
- Configure custom domain on Netlify: `myislam.iamfasih.com`

#### Option 3: Full VPS Deployment
For production-grade deployment:
- Use DigitalOcean, AWS, or similar
- Set up Node.js + PostgreSQL
- Configure Nginx reverse proxy
- Set up SSL with Let's Encrypt
- Point DNS A record to VPS IP

### Current Configuration

**Environment Variables Required:**
- `DATABASE_URL` - PostgreSQL connection string (already configured)
- `SESSION_SECRET` - Session encryption key (already configured)
- `OPENAI_API_KEY` - For AI features (already configured)
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` - Database credentials (already configured)

**Build Command:**
```bash
npm run build
```

**Start Command:**
```bash
npm start
```

**Database Migration:**
The database is already seeded with:
- 114 Surahs (6,236 Ayahs)
- 34,532 Authentic Hadiths
- 26 Islamic Books
- 10 Knowledge Topics
- 79 Content Links
- 17 Duas

### DNS Configuration for Custom Domain

When ready to deploy, configure these DNS records at your domain registrar:

```
Type: CNAME
Name: myislam
Value: <your-replit-deployment-url>
TTL: 3600
```

Or if CNAME is not supported:

```
Type: A
Name: myislam
Value: <replit-server-ip>
TTL: 3600
```

### Post-Deployment Checklist

- [ ] Verify all API routes work correctly
- [ ] Test Quran translations load properly
- [ ] Confirm Hadith search functions
- [ ] Check prayer times API integration
- [ ] Validate Zakat calculator with all currencies
- [ ] Test multi-language toggle (Arabic RTL/English/Urdu)
- [ ] Verify PDF viewer for Islamic books
- [ ] Test bookmark and reading history features
- [ ] Confirm OpenAI integrations (OCR, Hadith validation)
- [ ] Check mobile responsiveness
- [ ] Test dark/light mode
- [ ] Verify all authentication flows (if using Replit Auth)
- [ ] Monitor database performance
- [ ] Set up error logging and monitoring

### Performance Optimization

**Frontend:**
- Vite production build with tree-shaking
- Code splitting for routes
- Image optimization for assets
- Lazy loading for heavy components

**Backend:**
- Database connection pooling (Neon WebSocket)
- Query optimization with indexes
- Response caching where appropriate
- Rate limiting for API protection

**Database:**
- Indexed columns: surah_id, ayah_id, hadith_id, collection, grade
- Connection pooling for concurrent requests
- Query optimization for large datasets

### Security Considerations

- [x] Environment secrets properly configured
- [x] Session management with secure cookies
- [x] HTTPS enforced (via Replit/Netlify)
- [x] Input validation with Zod schemas
- [x] SQL injection protection via Drizzle ORM
- [x] XSS protection via React
- [ ] Rate limiting (recommended for production)
- [ ] CORS configuration for API
- [ ] Content Security Policy headers

### Monitoring & Maintenance

**Recommended Tools:**
- Error tracking: Sentry or similar
- Analytics: Plausible or privacy-focused alternative
- Uptime monitoring: UptimeRobot
- Database monitoring: Neon dashboard
- Performance: Web Vitals tracking

### Support

For deployment assistance:
- Replit Docs: https://docs.replit.com/hosting/deployments
- Contact: Fasih ur Rehman
- Credit: All credit to "Fasih ur Rehman"
