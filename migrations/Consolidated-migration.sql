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
);


INSERT INTO users
(
    display_name,
    auth_name,
    id,
    password,
    email,
    friends,
    friend_requests,
    online_status
)
VALUES
(
    'Violet',
    'Violet#15638',
    '15638',
    'password',
    'meow@email.com',
    ARRAY['Bob#15846','Cat#16846','HAXOR#98775'],
    ARRAY['Kiwa#87753'],
    1
),
(
    'Kiwa',
    'Kiwa#87753',
    '87753',
    'password',
    'kiwa@email.com',
    ARRAY[]::text[],
    ARRAY[]::text[],
    1
),
(
    'Bob',
    'Bob#15846',
    '15846',
    'password',
    'Bob@email.com',
    ARRAY['Violet#15638']::text[],
    ARRAY[]::text[],
    1
),
(
    'Cat',
    'Cat#16846',
    '16846',
    'password',
    'Cat@email.com',
    ARRAY['Violet#15638']::text[],
    ARRAY[]::text[],
    1
),
(
    'HAXOR',
    'HAXOR#98775',
    '98775',
    'password',
    'HAXOR@email.com',
    ARRAY['Violet#15638']::text[],
    ARRAY[]::text[],
    1
);


DROP TABLE IF EXISTS  channels CASCADE;

create table channels (
index SERIAL primary key,
id varchar(200) not null unique,
name varchar(200),
participants text[]

);

INSERT INTO channels
(
    id,
    name,
    participants

)
values
(
    '<3',
    '',
    ARRAY['Kiwa#87753','Violet#15638']
),
(
    '967f98sd6',
    '',
    ARRAY['Bob#15846','HAXOR#98775']
),
(
    'agsa4ag45',
    '',
    ARRAY['Cat#16846','HAXOR#98775']
),
(
    '456454',
    '',
    ARRAY['Bob#15846','Cat#16846','HAXOR#98775']
),
(
    'sag45dg46ad5g',
    'Cat Party',
    ARRAY['Bob#15846','Cat#16846','HAXOR#98775','Violet#15638']
);


DROP TABLE IF EXISTS  messages CASCADE;

create table messages (
index SERIAL primary key,
id varchar(200) not null unique,
message varchar(512) not null,
date varchar(200) not null,
channel varchar(200) not null,
sender varchar(200) not null
);

INSERT INTO messages
(
    channel,
    message,
    sender,
    date,
    id

)
VALUES
(
    'sag45dg46ad5g',
    'Hey there!',
    'Violet#15638',
    '1599675475651',
    'asfsaf'
),
(
    'sag45dg46ad5g',
    'Heya, this is great!',
    'Cat#16846',
    '1599675475651',
    'asfsafsafasf'
),
(
    'sag45dg46ad5g',
    'Wow I know right?',
    'HAXOR#98775',
    '1599675475651',
    '44sd45dd'
),
(
    'sag45dg46ad5g',
    'Bruh!',
    'Shitbag#277',
    '1599675475651',
    '4fs5d4ga65'
);






