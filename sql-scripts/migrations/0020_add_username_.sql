DROP VIEW help_request_status;
DROP VIEW user_feedback_status;
DROP VIEW flagged_content_status;

CREATE VIEW help_request_status AS
SELECT
	hrs.help_request_status_id,
    hrs.help_request_id,
    hrs.category,
    hrs.status,
    hrs.action_taken,
    hrs.notes,
    hr.user_id,
    u.username,
    hr.message,
    hr.time_logged,
    hrs.time_closed
FROM
    help_requests hr
    JOIN help_request_statuses hrs ON hr.help_request_id=hrs.help_request_id
    JOIN users u ON hr.user_id=u.user_id;

CREATE VIEW user_feedback_status AS
SELECT
	ufs.user_feedback_status_id,
    ufs.user_feedback_id,
    ufs.category,
    ufs.status,
    ufs.action_taken,
    ufs.notes,
    uf.user_id,
    u.username,
    uf.message,
    uf.time_logged,
    ufs.time_closed
FROM
    user_feedback uf
    JOIN user_feedback_statuses ufs ON uf.user_feedback_id=ufs.user_feedback_id
    JOIN users u ON uf.user_id=u.user_id; 

CREATE VIEW flagged_content_status AS
SELECT
	fcs.flagged_content_status_id,
    fcs.flagged_content_id,
    fcs.category,
    fcs.status,
    fcs.action_taken,
    fcs.notes,
    fc.user_id,
    u.username,
    fc.content_type,
    fc.content_id,
    fc.time_logged,
    fcs.time_closed
FROM
    flagged_content fc
    JOIN flagged_content_statuses fcs ON fc.flagged_content_id=fcs.flagged_content_id
    JOIN users u ON fc.user_id=u.user_id;