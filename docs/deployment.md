# Deployment

## 1. Supabase

1. Create a Supabase project.
2. Run your **private** schema SQL in the SQL Editor  
   (`supabase/schema.sql` is kept local and is **not** published to GitHub).
3. **Create admin email + password** (Auth owns the password — not SQL):
   - Authentication → Users → **Add user**
   - Email: `admin@yourdomain.com` (use your real address)
   - Password: choose a strong password
   - Enable **Auto Confirm User**
4. Copy the new user’s **User UID**.
5. Grant admin access (placeholders only):

```sql
insert into public.admin_users (user_id, email)
values (
  '00000000-0000-0000-0000-000000000000',  -- paste User UID
  'admin@yourdomain.com'                  -- same email as Auth
)
on conflict (user_id) do update set email = excluded.email;
```

6. Sign in at `/admin/login` with that email and password.
7. Copy Project URL + publishable key + secret/service role key into env (see `.env.example`).

## 2. Site settings

After login at `/admin/settings`, set:

- contact email
- domain
- office location
- buy-out terms
- discovery URL (must be relative `/…`, `https://…`, or `mailto:`)

Call-widget placeholders (`[PHONE NUMBER]`, after-hours line, hours label / timezone) are defined in code defaults and optional `site_settings` columns when your private schema includes them. Preview open/after UI with `?call=open` or `?call=after`.

Homepage revalidates on save. Footer **Admin** links to `/admin/login`.

## 3. Vercel

Env vars:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`
- `NEXT_PUBLIC_SITE_URL` (production domain)

Deploy a preview, verify `/`, `/request`, `/admin/login`, then promote.

## 4. Local

```bash
npm install
npm run build
npm start
```

## 5. Security checklist before production

- [ ] Schema + RLS applied from private SQL (not from this public repo)
- [ ] Strong admin password; consider Supabase Auth CAPTCHA / MFA
- [ ] No service-role key in client or committed files
- [ ] Real contact phone / email set; placeholders removed
- [ ] Privacy & terms copy reviewed
