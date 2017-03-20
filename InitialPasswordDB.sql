CREATE TABLE Account (
    UID serial8 PRIMARY KEY,
    UName varchar(64) NOT NULL,
    HashPass varchar(128) NOT NULL,
    Salt varchar(16) NOT NULL
);
