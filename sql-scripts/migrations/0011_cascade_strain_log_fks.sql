alter table strain_log_comments
    drop constraint strain_log_comments_log_id_fkey,
    add constraint strain_log_comments_log_id_fkey foreign key (log_id) references strain_logs(strain_log_id)
    on delete cascade;

alter table favorite_logs
    drop constraint favorite_logs_log_id_fkey,
    add constraint favorite_logs_log_id_fkey foreign key (log_id) references strain_logs(strain_log_id)
    on delete cascade;

alter table bookmark_logs
    drop constraint bookmark_logs_log_id_fkey,
    add constraint bookmark_logs_log_id_fkey foreign key (log_id) references strain_logs(strain_log_id)
    on delete cascade;