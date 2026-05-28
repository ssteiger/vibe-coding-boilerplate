-- Create the application's `logs` table used by the activity-logs page and the
-- `Logger` utility in `apps/my-app/src/utils/logger.ts`.
create table if not exists public.logs (
  id serial not null,
  created_at timestamp with time zone null default now(),
  message text not null,
  constraint logs_pkey primary key (id)
);
