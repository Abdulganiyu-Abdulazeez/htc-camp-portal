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
  "campFee" numeric not null default 8500,
  "capacityLimit" integer not null default 500,
  "startDate" text not null default '2026-07-25',
  "endDate" text not null default '2026-07-27',
  "autoGroupingEnabled" boolean not null default true
);

-- Insert initial settings row if not exists
insert into public.settings (id, "campFee", "capacityLimit", "startDate", "endDate", "autoGroupingEnabled")
values (1, 8500, 500, '2026-07-25', '2026-07-27', true)
on conflict (id) do nothing;

-- Enable RLS for settings
alter table public.settings enable row level security;

-- Create policies for settings
create policy "Allow public select of settings" on public.settings
  for select using (true);

create policy "Allow public update of settings" on public.settings
  for update using (true);
