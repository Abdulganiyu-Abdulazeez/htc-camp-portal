-- Create delegates table
create table if not exists public.delegates (
  id text primary key,
  reference text unique not null,
  "fullName" text not null,
  email text not null,
  phone text not null,
  gender text not null check (gender in ('Male', 'Female')),
  category text not null check (category in ('Secondary School', 'Undergraduate/Leaver', 'Others')),
  school text not null,
  "secondaryDistrict" text,
  "secondaryClass" text,
  "courseOfStudy" text,
  "yearOfStudy" text,
  "jobTitle" text,
  "employmentMode" text,
  "medicalCondition" text not null,
  "nutAllergy" boolean default false,
  "lactoseIntolerance" boolean default false,
  "medicationAllergy" boolean default false,
  "otherAllergies" text,
  "chronicConditions" text,
  "bloodGroup" text,
  "genotype" text,
  "emergencyContactName" text not null,
  "emergencyContactPhone" text not null,
  "paymentStatus" text not null check ("paymentStatus" in ('verified', 'pending')),
  "assignedGroup" text not null default 'None',
  "assignedRoom" text not null default 'None',
  "skillOfInterest" text not null default 'None',
  "createdAt" timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) for delegates
alter table public.delegates enable row level security;

-- Create policies for public access (registration and lookup)
create policy "Allow public insert to delegates" on public.delegates
  for insert with check (true);

create policy "Allow public select of delegates" on public.delegates
  for select using (true);

create policy "Allow public update of delegates" on public.delegates
  for update using (true);

create policy "Allow public delete of delegates" on public.delegates
  for delete using (true);

-- Create settings table
create table if not exists public.settings (
  id integer primary key default 1 check (id = 1),
  "campFee" numeric not null default 6000,
  "campFeeSecondary" numeric not null default 4000,
  "campFeeUndergrad" numeric not null default 6000,
  "capacityLimit" integer not null default 500,
  "startDate" text not null default '2026-07-25',
  "endDate" text not null default '2026-07-27',
  "autoGroupingEnabled" boolean not null default true
);

-- Insert initial settings row if not exists
insert into public.settings (id, "campFee", "campFeeSecondary", "campFeeUndergrad", "capacityLimit", "startDate", "endDate", "autoGroupingEnabled")
values (1, 6000, 4000, 6000, 500, '2026-07-25', '2026-07-27', true)
on conflict (id) do nothing;

-- Enable RLS for settings
alter table public.settings enable row level security;

-- Create policies for settings
create policy "Allow public select of settings" on public.settings
  for select using (true);

create policy "Allow public update of settings" on public.settings
  for update using (true);

-- Create administrators table
create table if not exists public.administrators (
  id text primary key,
  "fullName" text not null,
  email text unique not null,
  role text not null check (role in ('Super Admin', 'Registry')),
  status text not null check (status in ('Active', 'Pending')),
  "lastLogin" text,
  "createdAt" timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for administrators
alter table public.administrators enable row level security;

-- Create policies for administrators
create policy "Allow public insert to administrators" on public.administrators for insert with check (true);
create policy "Allow public select of administrators" on public.administrators for select using (true);
create policy "Allow public update of administrators" on public.administrators for update using (true);
create policy "Allow public delete of administrators" on public.administrators for delete using (true);



insert into public.administrators (id, "fullName", email, role, status)
values ('admin_abdulganiyu', 'Abdulganiyu Abdulazeez', 'abdulganiyuabdulazeez20@gmail.com', 'Super Admin', 'Active')
on conflict (id) do nothing;

insert into public.administrators (id, "fullName", email, role, status)
values ('admin_fazazi', 'Fazazi Abdulbasit', 'fazaziishola@gmail.com', 'Super Admin', 'Active')
on conflict (id) do nothing;

-- Create announcements table
create table if not exists public.announcements (
  id text primary key,
  title text not null,
  category text not null check (category in ('Logistics', 'Curriculum', 'Emergency', 'Spiritual')),
  content text not null,
  "expiryDate" text,
  status text not null check (status in ('Published', 'Draft')),
  attachments jsonb default '[]'::jsonb,
  "createdAt" timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for announcements
alter table public.announcements enable row level security;

-- Create policies for announcements
create policy "Allow public insert to announcements" on public.announcements for insert with check (true);
create policy "Allow public select of announcements" on public.announcements for select using (true);
create policy "Allow public update of announcements" on public.announcements for update using (true);
create policy "Allow public delete of announcements" on public.announcements for delete using (true);

-- Migration statement to run in SQL Editor if table already exists:
-- alter table public.announcements add column if not exists attachments jsonb default '[]'::jsonb;
