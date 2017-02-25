# Fish-login
It's a login and authentication system written in node.js which under developing.

npm package used in this project: <br />
____Expressjs <br />
______cookieParser <br />
______bodyParser <br />
______session <br />
____node-postgres <br />
Use PostgreSQL as the database. <br />
The schema is list as below: <br />
 <br />
CREATE TABLE Account ( <br />
____UID serial8 PRIMARY KEY, <br />
____UName varchar(64) NOT NULL, <br />
____HashPass varchar(128) NOT NULL, <br />
____Salt varchar(16) NOT NULL <br />
); <br />
