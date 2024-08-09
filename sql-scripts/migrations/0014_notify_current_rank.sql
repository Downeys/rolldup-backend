insert into notifications(noti_type, noti_message, is_read, additional_properties, recipient_id)
select 'rank', 'You''re getting higher!', false, hstore('newRankLabel', user_rank), user_id from users;
