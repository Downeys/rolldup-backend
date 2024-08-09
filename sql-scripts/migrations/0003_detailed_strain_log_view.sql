CREATE VIEW detailed_strain_logs AS
SELECT sl.*,
(SELECT count(*) FROM strain_log_comments slc 
 WHERE slc.log_id = sl.strain_log_id) AS comment_count,
 (SELECT count(*) FROM favorite_logs fl
 WHERE fl.log_id = sl.strain_log_id) AS favorite_count
FROM strain_logs sl;