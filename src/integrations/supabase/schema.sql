-- =============================================
-- DentaCare Database Schema
-- Run this in your Supabase SQL Editor
-- =============================================

-- 1. Dentists table
create table if not exists public.dentists (
  id serial primary key,
  name text not null,
  specialty text not null,
  avatar text not null,
  created_at timestamptz default now()
);

-- 2. Appointments table
create table if not exists public.appointments (
  id serial primary key,
  patient text not null,
  patient_email text,
  patient_phone text,
  dentist text not null,
  date text not null,
  time text not null,
  service text not null,
  status text not null default 'pending',
  created_at timestamptz default now()
);

-- 3. Blocked slots table
create table if not exists public.blocked_slots (
  id serial primary key,
  dentist_id integer references public.dentists(id) on delete cascade not null,
  day text not null,
  slot text not null,
  created_at timestamptz default now(),
  unique(dentist_id, day, slot)
);

-- 4. Blog posts table
create table if not exists public.blog_posts (
  id serial primary key,
  title text not null,
  category text not null,
  author text not null,
  content text,
  published boolean default false,
  images text[] default '{}',
  created_at timestamptz default now()
);

-- 4b. Add images column if upgrading existing table
alter table public.blog_posts add column if not exists images text[] default '{}';

-- 5. User roles table (admin roles)
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role text not null check (role in ('admin', 'user')),
  unique(user_id, role),
  created_at timestamptz default now()
);

-- 6. Security definer function to check roles
create or replace function public.has_role(_user_id uuid, _role text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- =============================================
-- Enable RLS
-- =============================================
alter table public.dentists enable row level security;
alter table public.appointments enable row level security;
alter table public.blocked_slots enable row level security;
alter table public.blog_posts enable row level security;
alter table public.user_roles enable row level security;

-- =============================================
-- RLS Policies
-- =============================================

-- Dentists: public read, admin write
create policy "Anyone can view dentists" on public.dentists for select using (true);
create policy "Admins can manage dentists" on public.dentists for all
  using (public.has_role(auth.uid(), 'admin'));

-- Appointments: public insert, admin read/update
create policy "Anyone can create appointments" on public.appointments for insert with check (true);
create policy "Admins can view all appointments" on public.appointments for select
  using (public.has_role(auth.uid(), 'admin'));
create policy "Admins can update appointments" on public.appointments for update
  using (public.has_role(auth.uid(), 'admin'));
create policy "Admins can delete appointments" on public.appointments for delete
  using (public.has_role(auth.uid(), 'admin'));

-- Blocked slots: public read, admin write
create policy "Anyone can view blocked slots" on public.blocked_slots for select using (true);
create policy "Admins can manage blocked slots" on public.blocked_slots for all
  using (public.has_role(auth.uid(), 'admin'));

-- Blog posts: published posts public, admin full access
create policy "Anyone can view published posts" on public.blog_posts for select
  using (published = true or public.has_role(auth.uid(), 'admin'));
create policy "Admins can manage blog posts" on public.blog_posts for all
  using (public.has_role(auth.uid(), 'admin'));

-- User roles: users can read their own role, admins can read all
create policy "Users can view own role" on public.user_roles for select
  using (auth.uid() = user_id);
create policy "Admins can manage roles" on public.user_roles for all
  using (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- Seed Data
-- =============================================
insert into public.dentists (name, specialty, avatar) values
  ('Dr. Aisha Patel', 'General & Cosmetics', 'AP'),
  ('Dr. James Morrison', 'Orthodontics', 'JM'),
  ('Dr. Lisa Chen', 'Pediatric Dentistry', 'LC')
on conflict do nothing;

insert into public.blog_posts (title, category, author, published) values
  ('10 Tips for Maintaining a Healthy Smile at Home', 'Oral Health', 'Dr. Aisha Patel', true),
  ('What to Expect During Your First Dental Visit', 'Patient Guide', 'Dr. James Morrison', true),
  ('Teeth Whitening: Professional vs At-Home Treatments', 'Cosmetic Dentistry', 'Dr. Aisha Patel', false)
on conflict do nothing;

-- =============================================
-- Storage: Blog Images Bucket
-- Run this to create the blog-images bucket
-- =============================================
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

-- Allow public to read blog images
create policy if not exists "Public can view blog images"
  on storage.objects for select
  using (bucket_id = 'blog-images');

-- Allow admins to upload/delete blog images
create policy if not exists "Admins can upload blog images"
  on storage.objects for insert
  with check (bucket_id = 'blog-images' and public.has_role(auth.uid(), 'admin'));

create policy if not exists "Admins can delete blog images"
  on storage.objects for delete
  using (bucket_id = 'blog-images' and public.has_role(auth.uid(), 'admin'));
