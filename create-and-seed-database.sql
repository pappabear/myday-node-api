DROP DATABASE IF EXISTS myday-node-db;
CREATE DATABASE myday-node-db;

\c myday-node-db;

CREATE TABLE tasks (
  ID SERIAL PRIMARY KEY,
  subject VARCHAR,
  is_complete BOOLEAN,
  due_date DATE
);

INSERT INTO tasks (subject, is_complete, due_date) VALUES ('due today', false, CURRENT_DATE);
INSERT INTO tasks (subject, is_complete, due_date) VALUES ('due tomorrow', false, CURRENT_DATE + INTERVAL '1 day');
INSERT INTO tasks (subject, is_complete, due_date) VALUES ('due yesterday and late', false, CURRENT_DATE - INTERVAL '1 day');

