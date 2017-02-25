# Fish-login
It's a login and authentication system written in node.js which under developing.

npm package used in this project: <br />
    Expressjs <br />
      cookieParser <br />
      bodyParser <br />
      session <br />
    node-postgres <br />
Use PostgreSQL as the database. <br />
The schema is list as below: <br />
 <br />
CREATE TABLE Account ( <br />
    UID serial8 PRIMARY KEY, <br />
    UName varchar(64) NOT NULL, <br />
    HashPass varchar(128) NOT NULL, <br />
    Salt varchar(16) NOT NULL <br />
); <br />
