create extension if not exists hstore;

alter table notifications
    add column additional_properties hstore not null default '';
