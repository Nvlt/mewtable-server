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
)
