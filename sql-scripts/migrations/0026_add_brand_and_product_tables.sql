CREATE TABLE brand(
	brand_id SERIAL PRIMARY KEY,
    name TEXT,
    street1 TEXT,
    street2 TEXT,
    city TEXT,
    state_code TEXT,
    country_code TEXT,
    phone TEXT,
    email TEXT,
    url TEXT
);

CREATE TABLE product(
	product_id SERIAL PRIMARY KEY,
    name TEXT,
    category TEXT,
    brand_id INT
);

ALTER TABLE strain_logs
    ADD brand_id INT;
    
ALTER TABLE strain_logs
    ADD product_id INT;

DROP VIEW detailed_strain_logs;

CREATE VIEW detailed_strain_logs AS
SELECT 
    sl.*,
    s.category,
    s.strain,
    s.name as strain_name,
    b.name as brand_name,
    p.name as product_name,
    pl.name as purchase_location_name,
    (SELECT count(*) FROM strain_log_comments slc WHERE slc.log_id = sl.strain_log_id) AS comment_count,
    (SELECT count(*) FROM favorite_logs fl WHERE fl.log_id = sl.strain_log_id) AS favorite_count
FROM strain_logs sl
LEFT JOIN strains s ON sl.strain_id = s.strain_id
LEFT JOIN brand b ON sl.brand_id = b.brand_id
LEFT JOIN product p ON sl.product_id = p.product_id
LEFT JOIN purchase_location pl ON sl.purchase_location_id =pl.purchase_location_id;
