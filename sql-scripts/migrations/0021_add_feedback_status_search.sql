CREATE EXTENSION IF NOT EXISTS pg_trgm;

ALTER TABLE help_requests ADD COLUMN search_vector tsvector;
ALTER TABLE help_request_statuses ADD COLUMN search_vector tsvector;

UPDATE help_requests SET search_vector =
  to_tsvector('english', COALESCE(user_id::text, '') || ' ' ||
                          COALESCE(message::text, '') || ' ' ||
                          COALESCE(time_logged::text, '') || ' '
                          );

UPDATE help_request_statuses SET search_vector =
  to_tsvector('english', COALESCE(category::text, '') || ' ' ||
                          COALESCE(status::text, '') || ' ' ||
                          COALESCE(action_taken::text, '') || ' ' ||
                          COALESCE(notes::text, '') || ' ' || 
                          COALESCE(time_closed::text, '') || ' ' 
                          );

CREATE INDEX idx_help_request_search_vector ON help_requests USING gin(search_vector);
CREATE INDEX idx_help_request_statuses_search_vector ON help_request_statuses USING gin(search_vector);

ALTER TABLE user_feedback ADD COLUMN search_vector tsvector;
ALTER TABLE user_feedback_statuses ADD COLUMN search_vector tsvector;

UPDATE user_feedback SET search_vector =
  to_tsvector('english', COALESCE(user_id::text, '') || ' ' ||
                          COALESCE(message::text, '') || ' ' ||
                          COALESCE(time_logged::text, '') || ' '
                          );

UPDATE user_feedback_statuses SET search_vector =
  to_tsvector('english', COALESCE(category::text, '') || ' ' ||
                          COALESCE(status::text, '') || ' ' ||
                          COALESCE(action_taken::text, '') || ' ' ||
                          COALESCE(notes::text, '') || ' ' || 
                          COALESCE(time_closed::text, '') || ' ' 
                          );

CREATE INDEX idx_user_feedback_search_vector ON user_feedback USING gin(search_vector);
CREATE INDEX idx_user_feedback_statuses_status_search_vector ON user_feedback_statuses USING gin(search_vector);

ALTER TABLE flagged_content ADD COLUMN search_vector tsvector;
ALTER TABLE flagged_content_statuses ADD COLUMN search_vector tsvector;

UPDATE flagged_content SET search_vector =
  to_tsvector('english', COALESCE(user_id::text, '') || ' ' ||
                          COALESCE(content_type::text, '') || ' ' ||
                          COALESCE(content_id::text, '') || ' ' ||
                          COALESCE(time_logged::text, '') || ' '
                          );

UPDATE flagged_content_statuses SET search_vector =
  to_tsvector('english', COALESCE(category::text, '') || ' ' ||
                          COALESCE(status::text, '') || ' ' ||
                          COALESCE(action_taken::text, '') || ' ' ||
                          COALESCE(notes::text, '') || ' ' || 
                          COALESCE(time_closed::text, '') || ' ' 
                          );

CREATE INDEX idx_flagged_content_search_vector ON flagged_content USING gin(search_vector);
CREATE INDEX idx_flagged_content_statuses_status_search_vector ON flagged_content_statuses USING gin(search_vector);
