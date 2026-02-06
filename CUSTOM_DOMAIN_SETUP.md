# Custom Domain Setup - anoushkagarg.com

This guide covers connecting your GoDaddy domain to Vercel.

## Overview

Domain: `anoushkagarg.com`
Registrar: GoDaddy
Hosting: Vercel

---

## Step 1: Add Domain in Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your portfolio project
3. Click **Settings** → **Domains**
4. Add both:
   - `anoushkagarg.com`
   - `www.anoushkagarg.com`

Vercel will show you the DNS records needed.

---

## Step 2: Configure DNS in GoDaddy

### Option A: Recommended - Point to Vercel (keeps GoDaddy DNS)

1. Log into [GoDaddy](https://www.godaddy.com)
2. Go to **My Products** → **Domains**
3. Click **DNS** next to `anoushkagarg.com`
4. Add/Update the following records:

#### For Root Domain (anoushkagarg.com):
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 600 seconds (or default)
```

#### For WWW Subdomain:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 600 seconds (or default)
```

**Note:** Delete any existing A or CNAME records for @ and www that conflict.

### Option B: Use Vercel DNS (recommended for advanced features)

If you want to use Vercel's nameservers:

1. In Vercel, when adding the domain, select **Use Vercel Nameservers**
2. Vercel will provide nameserver addresses like:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```
3. In GoDaddy:
   - Go to domain settings
   - Click **Change Nameservers**
   - Select **Custom nameservers**
   - Enter Vercel's nameservers
   - Save

⚠️ **Warning:** This transfers all DNS control to Vercel. Email and other services will stop working unless reconfigured in Vercel.

---

## Step 3: Verify Domain

1. After configuring DNS, return to Vercel
2. Click **Refresh** on the domain
3. Wait for DNS propagation (can take 5 minutes to 48 hours, usually < 1 hour)
4. Vercel will show ✓ when domain is verified

---

## Step 4: Set Primary Domain

In Vercel domain settings:
1. Set `anoushkagarg.com` as the **primary domain**
2. Vercel will automatically redirect `www.anoushkagarg.com` → `anoushkagarg.com`

---

## SSL Certificate

Vercel automatically provides a free SSL certificate (HTTPS) once the domain is verified. No action needed.

---

## Troubleshooting

### Domain not verifying
- Wait longer (DNS can take time)
- Check GoDaddy DNS records are correct
- Use [DNS Checker](https://dnschecker.org) to verify propagation

### "Invalid Configuration" error
- Ensure no conflicting A/CNAME records in GoDaddy
- Remove old hosting provider records
- Double-check record values match Vercel exactly

### WWW not redirecting
- Ensure CNAME for www is set to `cname.vercel-dns.com`
- Clear browser cache
- Test in incognito mode

---

## Current Status

- Domain: ✓ Purchased from GoDaddy
- Vercel Project: ✓ Deployed
- DNS Configuration: ⏳ Pending
- SSL Certificate: ⏳ Auto-configured after DNS verification

---

## Quick Reference

**GoDaddy DNS Records:**
```
A     @    76.76.21.21
CNAME www  cname.vercel-dns.com
```

**Vercel Dashboard:**
https://vercel.com/dashboard → Your Project → Settings → Domains
