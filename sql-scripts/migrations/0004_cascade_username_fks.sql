alter table user_endorsements
    drop constraint user_endorsements_username_fkey,
    add constraint user_endorsements_username_fkey foreign key (username) references users(username)
    on update cascade;

alter table user_settings
    drop constraint user_settings_username_fkey,
    add constraint user_settings_username_fkey foreign key (username) references users(username)
    on update cascade;

alter table strain_logs
    drop constraint strain_logs_username_fkey,
    add constraint strain_logs_username_fkey foreign key (username) references users(username)
    on update cascade;

alter table strain_log_comments
    drop constraint strain_log_comments_owner_username_fkey,
    add constraint strain_log_comments_owner_username_fkey foreign key (owner_username) references users(username)
    on update cascade;

alter table favorite_logs
    drop constraint favorite_logs_username_fkey,
    add constraint favorite_logs_username_fkey foreign key (username) references users(username)
    on update cascade;

alter table bookmark_logs
    drop constraint bookmark_logs_username_fkey,
    add constraint bookmark_logs_username_fkey foreign key (username) references users(username)
    on update cascade;

alter table relationships
    drop constraint relationships_engager_fkey,
    add constraint relationships_engager_fkey foreign key (engager) references users(username)
    on update cascade;

alter table relationships
    drop constraint relationships_recipient_fkey,
    add constraint relationships_recipient_fkey foreign key (recipient) references users(username)
    on update cascade;

alter table notifications
    drop constraint notifications_engager_fkey,
    add constraint notifications_engager_fkey foreign key (engager) references users(username)
    on update cascade;

alter table notifications
    drop constraint notifications_recipient_fkey,
    add constraint notifications_recipient_fkey foreign key (recipient) references users(username)
    on update cascade;

alter table user_feedback
    drop constraint user_feedback_username_fkey,
    add constraint user_feedback_username_fkey foreign key (username) references users(username)
    on update cascade;

alter table help_requests
    drop constraint help_requests_username_fkey,
    add constraint help_requests_username_fkey foreign key (username) references users(username)
    on update cascade;

alter table reported_content
    drop constraint reported_content_username_fkey,
    add constraint reported_content_username_fkey foreign key (username) references users(username)
    on update cascade;
