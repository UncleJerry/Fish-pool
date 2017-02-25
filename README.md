# Fish-login
It's a login and authentication system written in node.js which under developing.

npm package used in this project:
    Expressjs
      cookieParser
      bodyParser
      session
    node-postgres
Use PostgreSQL as the database.
The schema is list as below:

CREATE TABLE Account (
    UID serial8 PRIMARY KEY,
    UName varchar(64) NOT NULL,
    HashPass varchar(128) NOT NULL,
    Salt varchar(16) NOT NULL
);
