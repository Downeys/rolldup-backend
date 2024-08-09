ALTER TABLE user_endorsements ADD user_id INT;
ALTER TABLE user_settings ADD user_id INT;
ALTER TABLE strain_logs ADD user_id INT;
ALTER TABLE strain_log_comments ADD owner_id INT;
ALTER TABLE favorite_logs ADD user_id INT;
ALTER TABLE bookmark_logs ADD user_id INT;
ALTER TABLE relationships ADD engager_id INT;
ALTER TABLE relationships ADD recipient_id INT;
ALTER table notifications ADD engager_id INT;
ALTER table notifications ADD recipient_id INT;
ALTER TABLE user_feedback ADD user_id INT;
ALTER TABLE help_requests ADD user_id INT;
ALTER TABLE reported_content ADD user_id INT;

UPDATE user_endorsements SET user_id = users.user_id
FROM users WHERE users.username = user_endorsements.username;

UPDATE user_settings SET user_id = users.user_id
FROM users WHERE users.username = user_settings.username;

UPDATE strain_logs SET user_id = users.user_id
FROM users WHERE users.username = strain_logs.username;

UPDATE strain_log_comments SET owner_id = users.user_id
FROM users WHERE users.username = strain_log_comments.owner_username;

UPDATE favorite_logs SET user_id = users.user_id
FROM users WHERE users.username = favorite_logs.username;

UPDATE bookmark_logs SET user_id = users.user_id
FROM users WHERE users.username = bookmark_logs.username;

UPDATE relationships SET engager_id = users.user_id
FROM users WHERE users.username = relationships.engager;

UPDATE relationships SET recipient_id = users.user_id
FROM users WHERE users.username = relationships.recipient;

UPDATE notifications SET engager_id = users.user_id
FROM users WHERE users.username = notifications.engager;

UPDATE notifications SET recipient_id = users.user_id
FROM users WHERE users.username = notifications.recipient;

UPDATE user_feedback SET user_id = users.user_id
FROM users WHERE users.username = user_feedback.username;

UPDATE help_requests SET user_id = users.user_id
FROM users WHERE users.username = help_requests.username;

UPDATE reported_content SET user_id = users.user_id
FROM users WHERE users.username = reported_content.username;

ALTER TABLE user_endorsements ADD CONSTRAINT user_endorsements_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(user_id);
ALTER TABLE user_settings ADD CONSTRAINT user_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(user_id);
ALTER TABLE strain_logs ADD CONSTRAINT strain_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(user_id);
ALTER TABLE strain_log_comments ADD CONSTRAINT strain_log_comments_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES users(user_id);
ALTER TABLE favorite_logs ADD CONSTRAINT favorite_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(user_id);
ALTER TABLE bookmark_logs ADD CONSTRAINT bookmark_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(user_id);
ALTER TABLE relationships ADD CONSTRAINT relationships_engager_id_fkey FOREIGN KEY (engager_id) REFERENCES users(user_id);
ALTER TABLE relationships ADD CONSTRAINT relationships_recipient_id_fkey FOREIGN KEY (recipient_id) REFERENCES users(user_id);
ALTER table notifications ADD CONSTRAINT notifications_engager_id_fkey FOREIGN KEY (engager_id) REFERENCES users(user_id);
ALTER table notifications ADD CONSTRAINT notifications_recipient_id_fkey FOREIGN KEY (recipient_id) REFERENCES users(user_id);
ALTER TABLE user_feedback ADD CONSTRAINT user_feedback_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(user_id);
ALTER TABLE help_requests ADD CONSTRAINT help_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(user_id);
ALTER TABLE reported_content ADD CONSTRAINT reported_content_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(user_id);

ALTER TABLE user_endorsements DROP CONSTRAINT user_endorsements_username_fkey;
ALTER TABLE user_settings DROP CONSTRAINT user_settings_username_fkey;
ALTER TABLE strain_logs DROP CONSTRAINT strain_logs_username_fkey;
ALTER TABLE strain_log_comments DROP CONSTRAINT strain_log_comments_owner_username_fkey;
ALTER TABLE favorite_logs DROP CONSTRAINT favorite_logs_username_fkey;
ALTER TABLE bookmark_logs DROP CONSTRAINT bookmark_logs_username_fkey;
ALTER TABLE relationships DROP CONSTRAINT relationships_engager_fkey;
ALTER TABLE relationships DROP CONSTRAINT relationships_recipient_fkey;
ALTER table notifications DROP CONSTRAINT notifications_engager_fkey;
ALTER table notifications DROP CONSTRAINT notifications_recipient_fkey;
ALTER TABLE user_feedback DROP CONSTRAINT user_feedback_username_fkey;
ALTER TABLE help_requests DROP CONSTRAINT help_requests_username_fkey;
ALTER TABLE reported_content DROP CONSTRAINT reported_content_username_fkey;

DROP VIEW detailed_strain_logs;

ALTER TABLE user_endorsements DROP COLUMN username;
ALTER TABLE user_settings DROP COLUMN username;
ALTER TABLE strain_logs DROP COLUMN username;
ALTER TABLE strain_log_comments DROP COLUMN owner_username;
ALTER TABLE favorite_logs DROP COLUMN username;
ALTER TABLE bookmark_logs DROP COLUMN username;
ALTER TABLE relationships DROP COLUMN engager;
ALTER TABLE relationships DROP COLUMN recipient;
ALTER table notifications DROP COLUMN engager;
ALTER table notifications DROP COLUMN recipient;
ALTER TABLE user_feedback DROP COLUMN username;
ALTER TABLE help_requests DROP COLUMN username;
ALTER TABLE reported_content DROP COLUMN username;

CREATE VIEW detailed_strain_logs AS
SELECT sl.*,
(SELECT count(*) FROM strain_log_comments slc 
 WHERE slc.log_id = sl.strain_log_id) AS comment_count,
 (SELECT count(*) FROM favorite_logs fl
 WHERE fl.log_id = sl.strain_log_id) AS favorite_count
FROM strain_logs sl;