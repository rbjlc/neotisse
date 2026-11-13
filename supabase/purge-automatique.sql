-- Facultatif (sécurité en plus) : suppression automatique, chaque nuit, des messages
-- et témoignages de plus de 3 ans, et du journal des modifications de plus d'un an. Le site le fait déjà à chaque ouverture du tableau de bord.
-- À coller dans Supabase : SQL Editor → New query → Run.
-- Si une erreur parle de « pg_cron », activez d'abord l'extension : Database → Extensions → pg_cron.

create extension if not exists pg_cron with schema pg_catalog;

select cron.schedule('neotisse-purge-3-ans', '15 3 * * *', $$
  delete from public.messages where cree_le < now() - interval '3 years';
  delete from public.temoignages where cree_le < now() - interval '3 years';
  delete from public.journal where cree_le < now() - interval '1 year';
$$);
