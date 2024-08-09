CREATE TABLE purchase_location(
	purchase_location_id SERIAL PRIMARY KEY,
    name TEXT,
    street1 TEXT,
    street2 TEXT,
    city TEXT,
    state_code TEXT,
    country_code TEXT,
    phone TEXT,
    email TEXT,
    url TEXT,
    geolocation POINT
);

ALTER TABLE strain_logs
    ADD purchase_location_id INT;
