DROP TABLE IF EXISTS  messages CASCADE;

create table messages (
index SERIAL primary key,
id varchar(200) not null unique,
message varchar(512) not null,
date varchar(200) not null,
channel varchar(200) not null,
sender varchar(200) not null
);