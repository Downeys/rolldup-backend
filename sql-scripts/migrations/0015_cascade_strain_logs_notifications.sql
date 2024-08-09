alter table notifications
    drop constraint notifications_log_id_fkey,
    add constraint notifications_log_id_fkey foreign key (log_id) references strain_logs(strain_log_id)
    on delete cascade;