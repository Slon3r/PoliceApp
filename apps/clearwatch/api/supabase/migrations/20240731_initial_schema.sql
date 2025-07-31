-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "postgis";

-- Create custom types
create type complaint_status as enum ('pending', 'under_review', 'resolved', 'dismissed');
create type incident_type as enum ('use_of_force', 'misconduct', 'discrimination', 'harassment', 'other');

-- Create tables
create table if not exists departments (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    city text not null,
    state text not null,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table if not exists officers (
    id uuid primary key default uuid_generate_v4(),
    badge_number text not null,
    first_name text not null,
    last_name text not null,
    department_id uuid references departments(id),
    rank text,
    status text not null default 'active',
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    unique(department_id, badge_number)
);

create table if not exists incidents (
    id uuid primary key default uuid_generate_v4(),
    type incident_type not null,
    description text not null,
    location geometry(Point, 4326),
    occurred_at timestamptz not null,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table if not exists complaints (
    id uuid primary key default uuid_generate_v4(),
    incident_id uuid references incidents(id) not null,
    submitted_by uuid references auth.users(id) not null,
    status complaint_status not null default 'pending',
    description text not null,
    evidence_urls text[],
    witness_contact_info jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table if not exists officer_incidents (
    officer_id uuid references officers(id) not null,
    incident_id uuid references incidents(id) not null,
    role text not null,
    created_at timestamptz default now(),
    primary key (officer_id, incident_id)
);

-- Create indexes
create index if not exists officers_department_id_idx on officers(department_id);
create index if not exists officers_badge_number_idx on officers(badge_number);
create index if not exists incidents_type_idx on incidents(type);
create index if not exists incidents_occurred_at_idx on incidents(occurred_at);
create index if not exists complaints_status_idx on complaints(status);
create index if not exists complaints_submitted_by_idx on complaints(submitted_by);

-- Create spatial index for incident locations
create index if not exists incidents_location_idx on incidents using gist(location);

-- Enable Row Level Security (RLS)
alter table departments enable row level security;
alter table officers enable row level security;
alter table incidents enable row level security;
alter table complaints enable row level security;
alter table officer_incidents enable row level security;

-- Create RLS Policies

-- Departments are publicly readable
create policy "Departments are viewable by everyone"
    on departments for select
    to authenticated, anon
    using (true);

-- Officers are publicly readable
create policy "Officers are viewable by everyone"
    on officers for select
    to authenticated, anon
    using (true);

-- Incidents are publicly readable
create policy "Incidents are viewable by everyone"
    on incidents for select
    to authenticated, anon
    using (true);

-- Complaints can be created by authenticated users
create policy "Users can create complaints"
    on complaints for insert
    to authenticated
    with check (auth.uid() = submitted_by);

-- Users can view their own complaints and admins can view all
create policy "Users can view their own complaints"
    on complaints for select
    to authenticated
    using (
        auth.uid() = submitted_by
        or exists (
            select 1 from auth.users
            where auth.users.id = auth.uid()
            and auth.users.role = 'admin'
        )
    );

-- Create functions and triggers
create or replace function set_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Add updated_at triggers to all tables
create trigger set_updated_at
    before update on departments
    for each row
    execute function set_updated_at();

create trigger set_updated_at
    before update on officers
    for each row
    execute function set_updated_at();

create trigger set_updated_at
    before update on incidents
    for each row
    execute function set_updated_at();

create trigger set_updated_at
    before update on complaints
    for each row
    execute function set_updated_at();