NOVEX - Storefront + Admin starter

FILES
- index.html: public storefront (customers do not need accounts)
- admin.html: private admin login and product manager
- admin.js / admin.css: admin interface
- app.js / style.css: storefront
- supabase/schema.sql: database schema and row-level security
- config.example.js: configuration template

SETUP
1. Create a Supabase project at https://supabase.com.
2. In Supabase, open SQL Editor and run the full contents of supabase/schema.sql.
3. In Project Settings > API, copy the Project URL and anon/public key.
4. Copy config.example.js to config.js in the repository root. Replace the two placeholders.
   Never use the service_role key in config.js or any browser file.
5. In Supabase Authentication, create your admin user with your email and a strong password.
6. In Supabase SQL Editor, run this statement with your admin email:
   update auth.users
   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
   where email = 'YOUR-ADMIN-EMAIL';
7. Sign out and sign back in at /admin.html so the refreshed token includes the admin role.
8. Enable GitHub Pages for the main branch / (root). The public URL is:
   https://ahmed787-sudo.github.io/NOVEX/

ADMIN
- Open /admin.html and sign in with the admin account.
- Add/edit/delete products, category, price, compare-at price, stock, description and image URL.
- Only active products are visible on the public storefront.

IMPORTANT SECURITY / CURRENT SCOPE
- Supabase Row Level Security is enabled.
- Public visitors can read active products only.
- Only authenticated users whose trusted app_metadata role is "admin" can manage products.
- Do not put a Supabase service_role key in frontend files.
- The customer checkout, order submission, payment and shipping workflow are not implemented yet.
- The database and live catalog are not active until you create the Supabase project, run the SQL and configure config.js.
- GitHub Pages cannot securely store secrets. config.js contains only the public anon key, protected by database RLS.
