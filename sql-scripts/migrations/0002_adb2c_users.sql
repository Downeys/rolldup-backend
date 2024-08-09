CREATE TABLE adb2c_users(
	sub UUID NOT NULL PRIMARY KEY,
	user_id INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,

    foreign key (user_id) references users(user_id)
);
