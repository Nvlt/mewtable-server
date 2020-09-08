DROP TABLE IF EXISTS  users CASCADE;

create table users (
index SERIAL primary key,
display_name varchar(32) not null,
auth_name varchar(32) not null UNIQUE,
id varchar(200) not null unique,
password varchar(32) not null,
email varchar(100) not null unique,
friends text[],
friend_requests text[],
online_status integer,
display_pic varchar(1000),
status_message varchar(250)
)

