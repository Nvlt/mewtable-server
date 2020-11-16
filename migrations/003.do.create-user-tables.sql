DROP TABLE IF EXISTS  users CASCADE;

create table users (
index SERIAL primary key,
display_name TEXT not null,
auth_name TEXT not null UNIQUE,
id TEXT not null unique,
password TEXT not null,
email TEXT not null unique,
friends text[],
friend_requests text[],
online_status integer,
display_pic varchar(1000),
status_message varchar(250)
)

