-- ============================================
-- LIKES TABLE
-- ============================================
-- Stores user likes for recipes
-- Similar structure to favorites table

create table if not exists public.recipe_likes (
  id bigserial primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, recipe_id)
);

-- Indexes for performance
create index if not exists recipe_likes_user_id_idx on public.recipe_likes(user_id);
create index if not exists recipe_likes_recipe_id_idx on public.recipe_likes(recipe_id);
create index if not exists recipe_likes_created_at_idx on public.recipe_likes(created_at);

-- Enable Row Level Security
alter table public.recipe_likes enable row level security;

-- RLS Policies for recipe_likes
-- Anyone can read likes (to see like counts)
create policy "Anyone can read recipe likes"
on public.recipe_likes
for select
to public
using (true);

-- Only authenticated users can insert their own likes
create policy "Users can insert their own likes"
on public.recipe_likes
for insert
to authenticated
with check (user_id = auth.uid());

-- Users can delete only their own likes
create policy "Users can delete their own likes"
on public.recipe_likes
for delete
to authenticated
using (user_id = auth.uid());

-- ============================================
-- COMMENTS TABLE
-- ============================================
-- Stores comments on recipes
-- Supports editing (updated_at field)

create table if not exists public.recipe_comments (
  id bigserial primary key,
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes for performance
create index if not exists recipe_comments_recipe_id_idx on public.recipe_comments(recipe_id);
create index if not exists recipe_comments_user_id_idx on public.recipe_comments(user_id);
create index if not exists recipe_comments_created_at_idx on public.recipe_comments(created_at);

-- Enable Row Level Security
alter table public.recipe_comments enable row level security;

-- RLS Policies for recipe_comments
-- Anyone can read comments on published recipes
create policy "Anyone can read comments on published recipes"
on public.recipe_comments
for select
to public
using (
  exists (
    select 1 from public.recipes r
    where r.id = recipe_id and r.is_published = true
  )
);

-- Authors can read comments on their own recipes (including drafts)
create policy "Authors can read comments on their recipes"
on public.recipe_comments
for select
to authenticated
using (
  exists (
    select 1 from public.recipes r
    where r.id = recipe_id and r.author_id = auth.uid()
  )
);

-- Only authenticated users can insert comments
create policy "Authenticated users can insert comments"
on public.recipe_comments
for insert
to authenticated
with check (user_id = auth.uid());

-- Users can update only their own comments
create policy "Users can update their own comments"
on public.recipe_comments
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- Users can delete only their own comments
create policy "Users can delete their own comments"
on public.recipe_comments
for delete
to authenticated
using (user_id = auth.uid());

-- ============================================
-- TRIGGER: Auto-update updated_at for comments
-- ============================================
-- Automatically updates the updated_at timestamp when a comment is modified

create or replace function public.update_recipe_comment_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists update_recipe_comments_updated_at on public.recipe_comments;

create trigger update_recipe_comments_updated_at
before update on public.recipe_comments
for each row
execute function public.update_recipe_comment_updated_at();

