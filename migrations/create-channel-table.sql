DROP TABLE IF EXISTS  channels CASCADE;

create table channels (
index SERIAL primary key,
id varchar(200) not null unique,
name varchar(200),
participants text[]

)

