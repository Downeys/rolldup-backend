CREATE TABLE users(
	user_id SERIAL PRIMARY KEY,
	username TEXT UNIQUE,
    profile_pic TEXT,
    user_rank TEXT,
    join_date DATE
);

CREATE TABLE user_endorsements(
	user_endorsements_id SERIAL PRIMARY KEY,
	username TEXT UNIQUE,
	eula BOOLEAN,
    adult BOOLEAN,
	first_login BOOLEAN,
	foreign key (username) references users(username)
);

CREATE TABLE user_settings(
	user_settings_id SERIAL PRIMARY KEY,
	username TEXT UNIQUE,
	identity TEXT,
	birthdate DATE,
	public_profile BOOLEAN,
	dark_mode BOOLEAN,
	pn_messages BOOLEAN,
	pn_group_activities BOOLEAN,
	pn_comments BOOLEAN,
	pn_friend_requests BOOLEAN,
	pn_recommendations BOOLEAN,
	pn_newsletter BOOLEAN,
	foreign key (username) references users(username)
);

CREATE TABLE strains(
	strain_id SERIAL PRIMARY KEY,
    name TEXT,
    strain TEXT,
    category TEXT
);

CREATE TABLE strain_logs(
	strain_log_id SERIAL PRIMARY KEY,
    rating INT,
    review TEXT,
    pic_url TEXT,
    username TEXT,
    strain_id INT,
    cannabinoid TEXT,
    percentage INT,
    mgs INT,
    time_logged TIMESTAMPTZ,
    foreign key (username) references users(username),
    foreign key (strain_id) references strains(strain_id)
);

CREATE TABLE strain_log_comments(
	strain_log_comment_id SERIAL PRIMARY KEY,
	log_id int,
    owner_username TEXT,
    comment_message TEXT,
    time_logged TIMESTAMPTZ,
	foreign key (log_id) references strain_logs(strain_log_id),
    foreign key (owner_username) references users(username)
);

CREATE TABLE favorite_logs(
	favorite_id SERIAL PRIMARY KEY,
    username TEXT,
    log_id int,
    time_logged TIMESTAMPTZ,
    foreign key (username) references users(username),
    foreign key (log_id) references strain_logs(strain_log_id)
);

CREATE TABLE bookmark_logs(
	bookmark_id SERIAL PRIMARY KEY,
    username TEXT,
    log_id int,
    time_logged TIMESTAMPTZ,
    foreign key (username) references users(username),
    foreign key (log_id) references strain_logs(strain_log_id)
);

CREATE TABLE relationships(
	relationship_id SERIAL PRIMARY KEY,
	relationship_type VARCHAR(20),
    engager TEXT,
	recipient TEXT,
	status varchar(2),
    initiation_date DATE,
	last_updated_date DATE,
	foreign key (engager) references users(username),
	foreign key (recipient) references users(username)
);

create table notifications(
	noti_id SERIAL PRIMARY KEY,
	log_id int,
	engager TEXT,
	recipient TEXT,
    noti_type TEXT,
	noti_message text,
	is_read boolean,
	is_read_timestamp TIMESTAMPTZ,
    noti_timestamp TIMESTAMPTZ,
	foreign key (log_id) references strain_logs(strain_log_id),
	foreign key (engager) references users(username),
	foreign key (recipient) references users(username)
);

CREATE TABLE user_feedback(
	user_feedback_id SERIAL PRIMARY KEY,
    username TEXT,
    message TEXT,
    time_logged TIMESTAMPTZ,
    foreign key (username) references users(username)
);

CREATE TABLE help_requests(
	help_request_id SERIAL PRIMARY KEY,
    username TEXT,
    message TEXT,
    time_logged TIMESTAMPTZ,
    foreign key (username) references users(username)
);

CREATE TABLE reported_content(
	help_request_id SERIAL PRIMARY KEY,
    username TEXT,
    content_type TEXT,
    content_id INT,
    time_logged TIMESTAMPTZ,
    foreign key (username) references users(username)
);
