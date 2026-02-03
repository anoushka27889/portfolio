# Portfolio Deployment Guide

Complete guide to deploying your portfolio to Vercel with custom domain from GoDaddy.

## Prerequisites Checklist

- [x] Production build successful (`npm run build` ✓)
- [ ] GitHub repository with latest code pushed
- [ ] GoDaddy account access
- [ ] Vercel account (free tier)

---

## Step 1: Deploy to Vercel (5-10 minutes)

### Option A: Vercel Dashboard (Recommended - Easiest)

1. **Go to Vercel**
   - Visit https://vercel.com
   - Sign up/Login with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select your portfolio repository
   - Vercel auto-detects Next.js configuration

3. **Configure & Deploy**
   - Project Name: `anoushka-portfolio` (or your choice)
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Click **"Deploy"**

4. **Wait for Build**
   - First deployment takes 2-3 minutes
   - You'll get a URL like: `anoushka-portfolio.vercel.app`

### Option B: Vercel CLI (Alternative)

```bash
# Install Vercel CLI globally
npm i -g vercel

# Deploy from project directory
cd ~/portfolio
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name: anoushka-portfolio
# - Directory: ./
# - Override settings? No

# Production deployment
vercel --prod
```

---

## Step 2: Add Custom Domain (10 minutes)

### In Vercel Dashboard

1. **Navigate to Domains**
   - Go to your project
   - Click "Settings" → "Domains"

2. **Add Domain**
   - Enter: `anoushkagarg.com`
   - Click "Add"
   - Also add: `www.anoushkagarg.com`

3. **Get DNS Records**
   - Vercel will show you DNS records to add
   - **Copy these values** (example):
     ```
     Type: A
     Name: @
     Value: 76.76.21.21

     Type: CNAME
     Name: www
     Value: cname.vercel-dns.com
     ```

### In GoDaddy Dashboard

1. **Login to GoDaddy**
   - Go to https://godaddy.com
   - Login → My Products → Domains

2. **Manage DNS**
   - Find `anoushkagarg.com`
   - Click "DNS" or "Manage DNS"

3. **Add/Update Records**

   **A Record:**
   - Type: `A`
   - Name: `@` (represents root domain)
   - Value: `76.76.21.21` (Vercel's IP - use value from Vercel)
   - TTL: `600` (10 minutes)

   **CNAME Record:**
   - Type: `CNAME`
   - Name: `www`
   - Value: `cname.vercel-dns.com` (use value from Vercel)
   - TTL: `600`

4. **Save Changes**
   - Click "Save" or "Add Record"

### Verify Domain

- **In Vercel**: Click "Refresh" on domain status
- **DNS Propagation**: Can take 24-48 hours (usually 30 mins - 2 hours)
- **Check Status**: Use https://dnschecker.org

---

## Step 3: Enable Vercel Analytics

Your portfolio already has `@vercel/analytics` installed!

1. **In Vercel Dashboard**
   - Go to Project → "Analytics" tab
   - Analytics are automatically enabled (free tier: 100k data points/month)
   - View real-time Core Web Vitals

2. **That's it!** Analytics start tracking immediately.

---

## Step 4: Post-Deployment SEO Setup (20 minutes)

### Google Search Console

1. **Add Property**
   - Go to https://search.google.com/search-console
   - Click "Add Property" → "URL prefix"
   - Enter: `https://anoushkagarg.com`

2. **Verify Ownership**
   - Method: HTML tag
   - Copy the verification code from Google
   - Add to `app/layout.tsx` metadata (already has placeholder):
     ```typescript
     verification: {
       google: 'your-verification-code-here',
     }
     ```
   - Redeploy: `git commit && git push`
   - Click "Verify" in Google Search Console

3. **Submit Sitemap**
   - In Google Search Console → "Sitemaps"
   - Add sitemap URL: `https://anoushkagarg.com/sitemap.xml`
   - Click "Submit"

### Bing Webmaster Tools

1. **Add Site**
   - Go to https://www.bing.com/webmasters
   - Click "Add Site"
   - Enter: `https://anoushkagarg.com`

2. **Verify & Submit Sitemap**
   - Verify via HTML tag (similar to Google)
   - Submit sitemap: `https://anoushkagarg.com/sitemap.xml`

---

## Step 5: Test Social Previews (10 minutes)

### Facebook/Meta Sharing Debugger

1. Go to https://developers.facebook.com/tools/debug/
2. Enter: `https://anoushkagarg.com`
3. Click "Debug"
4. Check:
   - ✓ OG image appears (1200x630px)
   - ✓ Title: "Anoushka Garg - Product Designer"
   - ✓ Description shows correctly

5. Test individual project pages:
   - `https://anoushkagarg.com/rest`
   - `https://anoushkagarg.com/lumen`
   - etc.

### Twitter Card Validator

1. Go to https://cards-dev.twitter.com/validator
2. Enter: `https://anoushkagarg.com`
3. Click "Preview card"
4. Check:
   - ✓ Card type: Summary Large Image
   - ✓ Image renders
   - ✓ Title and description correct

### LinkedIn Post Inspector

1. Go to https://www.linkedin.com/post-inspector/
2. Enter: `https://anoushkagarg.com`
3. Click "Inspect"
4. Check preview

---

## Step 6: Run Lighthouse Audit (5 minutes)

### In Chrome DevTools

1. Open `https://anoushkagarg.com` in Chrome
2. Right-click → "Inspect"
3. Click "Lighthouse" tab
4. Select:
   - ✓ Performance
   - ✓ Accessibility
   - ✓ Best Practices
   - ✓ SEO
5. Click "Analyze page load"

### Target Scores

- **Performance**: 90+ (green)
- **Accessibility**: 95+ (green)
- **Best Practices**: 95+ (green)
- **SEO**: 100 (green)

---

## Post-Deployment Checklist

- [ ] Site loads at `https://anoushkagarg.com`
- [ ] `www.anoushkagarg.com` redirects to root domain
- [ ] Vercel Analytics tracking visits
- [ ] Google Search Console verified & sitemap submitted
- [ ] Bing Webmaster Tools verified & sitemap submitted
- [ ] Facebook preview working
- [ ] Twitter card preview working
- [ ] LinkedIn preview working
- [ ] Lighthouse scores 90+
- [ ] Test on mobile device
- [ ] Test all 6 project pages load correctly
- [ ] Test 404 page (`/nonexistent-page`)
- [ ] Check browser console for errors

---

## Troubleshooting

### Domain Not Working

**Issue**: `anoushkagarg.com` not loading after 24 hours

**Solutions**:
1. Check DNS records in GoDaddy match Vercel exactly
2. Verify DNS propagation: https://dnschecker.org
3. Clear browser cache (Cmd+Shift+R)
4. Try incognito mode
5. Check Vercel domain status (should show "Valid Configuration")

### Build Failed on Vercel

**Issue**: Deployment failed in Vercel

**Solutions**:
1. Check build logs in Vercel dashboard
2. Ensure `npm run build` works locally
3. Check Node.js version (Vercel uses Node 18+)
4. Verify all dependencies in package.json

### Images Not Loading

**Issue**: Images showing as broken

**Solutions**:
1. Check image paths are correct (relative to `/public`)
2. Verify images are in git (not in `.gitignore`)
3. Check browser console for 404 errors
4. Ensure image file extensions match exactly (case-sensitive)

### Analytics Not Tracking

**Issue**: No data in Vercel Analytics

**Solutions**:
1. Wait 5-10 minutes for first data
2. Visit site in different browser/incognito
3. Check Analytics are enabled in Vercel dashboard
4. Verify `<Analytics />` component in layout.tsx

---

## Updating Your Site

### Make Changes

```bash
# Edit files locally
# Test changes
npm run dev

# Build and test
npm run build

# Commit and push
git add .
git commit -m "Update portfolio content"
git push origin main
```

### Vercel Auto-Deploys

- Every push to `main` branch triggers automatic deployment
- Preview deployments for pull requests
- Rollback available in Vercel dashboard

---

## Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **DNS Propagation**: https://dnschecker.org
- **Vercel Support**: https://vercel.com/help

---

## Summary of What We Built

Your portfolio now has:

### ✅ SEO Optimized
- Dynamic sitemap.xml
- Robots.txt
- Meta descriptions for all pages
- Open Graph images (auto-generated)
- Twitter Cards
- JSON-LD structured data (Person + CreativeWork)
- Canonical URLs

### ✅ Performance Optimized
- Next.js Image optimization
- Vercel CDN
- Edge runtime for OG images
- Preloaded critical assets
- Compressed output

### ✅ Accessible
- Skip-to-content link
- ARIA labels
- Reduced motion support
- Semantic HTML
- Keyboard navigation

### ✅ Analytics
- Vercel Analytics (privacy-friendly)
- Core Web Vitals tracking
- Real user monitoring

### ✅ Secure
- HTTPS automatic
- Security headers (XSS, clickjacking protection)
- Content security policy

### ✅ Portable
- Standard Next.js code
- No vendor lock-in
- Can deploy anywhere (Vercel, Netlify, Cloudflare, self-hosted)

---

**You're all set! Your portfolio is production-ready and optimized for discovery by both traditional search engines and AI search tools.**

Good luck with your deployment! 🚀
