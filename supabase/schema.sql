-- Base de données du site Neotisse.
-- À coller une seule fois dans Supabase : SQL Editor → New query → Run.

-- Une table par type de contenu. Chaque fiche : un identifiant, ses champs (data), sa date.
do $$
declare t text;
begin
  foreach t in array array['reglages','pages','ateliers','evenements','actualites','partenaires','temoignages','messages','medias','comptes','journal'] loop
    execute format('create table if not exists public.%I (
      id text primary key default gen_random_uuid()::text,
      data jsonb not null default ''{}''::jsonb,
      cree_le timestamptz not null default now()
    )', t);
    -- Sécurité : personne ne lit ni n'écrit directement ces tables depuis Internet.
    -- Seul le serveur du site (clé « service_role », gardée secrète sur Netlify) y a accès.
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on public.%I from anon, authenticated', t);
  end loop;
end $$;

-- Photos : un espace de stockage public en lecture (les photos s'affichent sur le site).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('photos', 'photos', true, 10485760, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update set public = true;
