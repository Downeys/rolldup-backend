create type app_role as enum('ADMIN');

alter table users
    add column app_roles app_role[] not null default '{}';
