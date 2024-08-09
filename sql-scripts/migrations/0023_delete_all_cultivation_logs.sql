delete from strain_logs
where strain_id IN (
    select strain_id from strains where category='Cultivation'
);

delete from strains where category='Cultivation';