CREATE TABLE flagged_content(
	flagged_content_id SERIAL PRIMARY KEY,
    user_id INT,
    content_type TEXT,
    content_id INT,
    time_logged TIMESTAMPTZ,
    foreign key (user_id) references users(user_id) on update cascade
);

INSERT INTO flagged_content (user_id, content_type, content_id, time_logged)
SELECT user_id, content_type, content_id, time_logged FROM reported_content;
DROP TABLE reported_content;

CREATE TABLE help_request_statuses(
	help_request_status_id SERIAL PRIMARY KEY,
    help_request_id INT,
    category VARCHAR(26),
    status VARCHAR(26),
    action_taken TEXT,
    notes TEXT,
    time_closed TIMESTAMPTZ
);

CREATE TABLE user_feedback_statuses(
	user_feedback_status_id SERIAL PRIMARY KEY,
    user_feedback_id INT,
    category VARCHAR(26),
    status VARCHAR(26),
    action_taken TEXT,
    notes TEXT,
    time_closed TIMESTAMPTZ
);

CREATE TABLE flagged_content_statuses(
	flagged_content_status_id SERIAL PRIMARY KEY,
    flagged_content_id INT,
    category VARCHAR(26),
    status VARCHAR(26),
    action_taken TEXT,
    notes TEXT,
    time_closed TIMESTAMPTZ
);

INSERT INTO help_request_statuses (help_request_id, status)
SELECT help_request_id, 'unread' FROM help_requests;

INSERT INTO user_feedback_statuses (user_feedback_id, status)
SELECT user_feedback_id, 'unread' FROM user_feedback;

INSERT INTO flagged_content_statuses (flagged_content_id, status)
SELECT flagged_content_id, 'unread' FROM flagged_content;

CREATE VIEW help_request_status AS
SELECT
	hrs.help_request_status_id,
    hrs.help_request_id,
    hrs.category,
    hrs.status,
    hrs.action_taken,
    hrs.notes,
    hr.user_id,
    hr.message,
    hr.time_logged,
    hrs.time_closed
FROM help_requests hr JOIN help_request_statuses hrs ON hr.help_request_id=hrs.help_request_id;

CREATE VIEW user_feedback_status AS
SELECT
	ufs.user_feedback_status_id,
    ufs.user_feedback_id,
    ufs.category,
    ufs.status,
    ufs.action_taken,
    ufs.notes,
    uf.user_id,
    uf.message,
    uf.time_logged,
    ufs.time_closed
FROM user_feedback uf JOIN user_feedback_statuses ufs ON uf.user_feedback_id=ufs.user_feedback_id; 

CREATE VIEW flagged_content_status AS
SELECT
	fcs.flagged_content_status_id,
    fcs.flagged_content_id,
    fcs.category,
    fcs.status,
    fcs.action_taken,
    fcs.notes,
    fc.user_id,
    fc.content_type,
    fc.content_id,
    fc.time_logged,
    fcs.time_closed
FROM flagged_content fc JOIN flagged_content_statuses fcs ON fc.flagged_content_id=fcs.flagged_content_id;