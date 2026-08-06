# Admin Panel Setup Guide

Your admin panel is live at `/admin` with password: **mulesoo2025** (change this immediately!)

## Database Setup (Supabase)

Before using the admin panel, you need to create the `site_settings` table in Supabase.

### Step 1: Go to Supabase Console

1. Log in to [supabase.com](https://supabase.com)
2. Open your MuleSoo project
3. Go to **SQL Editor**

### Step 2: Run this SQL

Copy and paste this entire SQL block into the SQL Editor and click **Execute**:

```sql
-- Create site_settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id BIGSERIAL PRIMARY KEY,
  -- Business info
  phone TEXT DEFAULT '+27 68 852 9333',
  email TEXT DEFAULT 'hello@mulesoo.com',
  whatsapp TEXT DEFAULT '27688529333',
  address TEXT DEFAULT 'Pretoria, South Africa',
  hours TEXT DEFAULT 'Mon–Fri 8am–6pm SAST | Sat 9am–1pm',
  linkedin TEXT DEFAULT '',
  twitter TEXT DEFAULT '',
  instagram TEXT DEFAULT '',
  -- Homepage content
  hero_badge TEXT DEFAULT 'Intelligent Digital Solution',
  hero_title TEXT DEFAULT 'Digital Excellence',
  hero_subtitle TEXT DEFAULT 'AI Automation, Auto Pilot System, AI Chatbots, Professional Websites, Logos, and Digital Solutions built for businesses across the world.',
  stat1_value TEXT DEFAULT '50+',
  stat1_label TEXT DEFAULT 'Projects Delivered',
  stat2_value TEXT DEFAULT '100%',
  stat2_label TEXT DEFAULT 'Client Satisfaction',
  stat3_value TEXT DEFAULT '3+',
  stat3_label TEXT DEFAULT 'Years Experience',
  stat4_value TEXT DEFAULT '24/7',
  stat4_label TEXT DEFAULT 'Support Available',
  team_members TEXT DEFAULT '',
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS (optional, but recommended for security)
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows authenticated users to read
CREATE POLICY "Allow authenticated to read" ON public.site_settings
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Create a policy that allows only authenticated users to update
CREATE POLICY "Allow authenticated to update" ON public.site_settings
  FOR UPDATE
  USING (auth.role() = 'authenticated');
```

### Step 3: Insert Initial Data

```sql
INSERT INTO public.site_settings (
  phone, email, whatsapp, address, hours,
  linkedin, twitter, instagram,
  hero_badge, hero_title, hero_subtitle,
  stat1_value, stat1_label, stat2_value, stat2_label,
  stat3_value, stat3_label, stat4_value, stat4_label
) VALUES (
  '+27 68 852 9333', 'hello@mulesoo.com', '27688529333', 'Pretoria, South Africa', 'Mon–Fri 8am–6pm SAST | Sat 9am–1pm',
  '', '', '',
  'Intelligent Digital Solution', 'Digital Excellence', 'AI Automation, Auto Pilot System, AI Chatbots, Professional Websites, Logos, and Digital Solutions built for businesses across the world.',
  '50+', 'Projects Delivered', '100%', 'Client Satisfaction',
  '3+', 'Years Experience', '24/7', 'Support Available'
);
```

## Access Control

### Change Admin Password

Edit `app/admin/page.tsx` and change this line:

```typescript
if (password === 'mulesoo2025') {  // ← Change this
```

to your preferred password.

### Example: Set password to "MuleSoo@2025"

```typescript
if (password === 'MuleSoo@2025') {
```

**Important:** After changing the password, push to GitHub so it deploys to Netlify.

## What You Can Edit

### 1. Homepage Settings
- **Hero Badge** — the small pill above the headline
- **Hero Title** — main headline text
- **Hero Subtitle** — supporting text below headline
- **Stats** — update the 4 statistics (value + label)

### 2. Contact Information
- **Email** — business email address
- **Phone** — phone number
- **WhatsApp** — WhatsApp number (digits only)
- **Address** — physical location
- **Hours** — business hours
- **Social Links** — LinkedIn, Twitter, Instagram URLs

## Deployment

1. Make changes in the admin panel
2. Click "Save Changes"
3. Changes appear on your website instantly
4. No need to redeploy or restart

## Troubleshooting

### "Changes not saving"
- Check browser console (F12) for errors
- Verify Supabase API key in `.env.local`
- Make sure `site_settings` table exists in Supabase

### "Cannot reach admin panel"
- Verify `/admin` loads without errors
- Check that the site is deployed to Netlify
- Ensure `.env.local` is configured with Supabase keys

### "Table doesn't exist error"
- Run the SQL migration above in Supabase
- Refresh the admin page after creating the table

## Security Tips

1. **Change the password immediately** — don't use the default "mulesoo2025"
2. **Keep your Supabase keys safe** — never share them publicly
3. **Only share admin URL with trusted team members**
4. **Use a strong password** — at least 12 characters with symbols

## Future Enhancements

The admin panel can be expanded to include:
- ✅ Testimonials management
- ✅ FAQ management
- ✅ Team members
- ✅ Pricing tables
- ✅ Service descriptions
- ✅ Video testimonials
- ✅ Analytics dashboard

## Support

If you encounter issues:
1. Check that the `site_settings` table exists in Supabase
2. Verify environment variables in Netlify dashboard
3. Check browser console for JavaScript errors (F12 → Console tab)

---

**Admin Panel URL:** `https://your-domain.com/admin`  
**Default Password:** `mulesoo2025` (change this!)  
**Database:** Supabase PostgreSQL
