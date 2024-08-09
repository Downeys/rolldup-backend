insert into notifications(noti_type, noti_message, is_read, additional_properties, recipient_id)
select 'badge', 'You earned a new badge!', false, hstore(ARRAY[['level',level::text],['label',label]]), user_id from user_badges;
