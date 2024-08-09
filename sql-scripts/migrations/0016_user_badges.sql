create type badge_level as enum ('ONE', 'TWO', 'THREE', 'NOT_APPLICABLE');

create table user_badges (
    user_badge_id serial primary key,
    label         text not null,
    level         badge_level not null,
    user_id       int not null references users (user_id),
    awarded_at    timestamptz not null default now(),

    unique(label, level, user_id)
);

create index user_badges_user_id on user_badges (user_id);
