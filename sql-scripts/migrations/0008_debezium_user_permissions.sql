do $$
begin
   if not exists ( select from pg_roles  
                   where  rolname = 'debezium') then
      create user debezium;
   end if;
end
$$;

grant select on all tables in schema public to debezium;
grant insert, update, delete on public.debezium_signal to debezium;
