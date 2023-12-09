CREATE DATABASE IF NOT EXISTS database_library;

use database_library;

DROP TABLE IF EXISTS UserCommentUpvotes;
DROP TABLE IF EXISTS UserComments;
DROP TABLE IF EXISTS FavoriteTopicPoints;
DROP TABLE IF EXISTS TopicPoints;
DROP TABLE IF EXISTS Topics;
DROP TABLE IF EXISTS Subjects;
DROP TABLE IF EXISTS User;

CREATE TABLE User(
id int primary key not null Auto_increment,
email varchar(99),
password varchar(99),
firstName varchar(99),
lastName varchar(99),
profileImage LONGBLOB
);

CREATE TABLE Subjects(
subjectId int primary key not null Auto_increment,
subjectTitle varChar(100)
);

CREATE TABLE Topics(
topicId int primary key not null Auto_increment,
topicTitle varChar(100),
subjectId int,
Foreign Key(subjectId) references Subjects(subjectId)
);

CREATE TABLE TopicPoints(
topicPointId int primary key not null Auto_increment,
topicPointTitle varChar(100),
content varChar(1000),
topicId int,
createdAt datetime,
createdBy int,
Foreign Key(topicId) references Topics(topicId),
Foreign Key(createdBy) references User(id)
);

CREATE TABLE FavoriteTopicPoints(
userId int,
topicPointId int,
Foreign Key(userId) references User(id),
Foreign Key(topicPointId) references TopicPoints(topicPointId)
);

CREATE TABLE UserComments(
userCommentId int primary key not null Auto_increment,
userId int,
topicPointId int,
comment varchar(1000),
createdAt datetime,
imageBase64String LONGBLOB,
Foreign Key(userId) references User(id),
Foreign Key(topicPointId) references TopicPoints(topicPointId)
);

CREATE TABLE UserCommentUpvotes(
PRIMARY KEY (userId, userCommentId),
userId int,
userCommentId int,
Foreign Key(userId) references User(id),
Foreign Key(userCommentId) references UserComments(userCommentId)
);

Insert into User values (null, 'jo@jooo.de', '', "Selo3", "Yes3", null);

Insert into Subjects values (null, 'Geschichte');
Insert into Subjects values (null, 'Informatik');
Insert into Subjects values (null, 'Biologie');
Insert into Subjects values (null, 'Physik');
Insert into Subjects values (null, 'Chemie');
Insert into Subjects values (null, 'Spanisch');

Insert into Topics values (null, 'Erster Weltrkieg', 1);
Insert into Topics values (null, 'Zweiter Weltrkieg', 1);
Insert into Topics values (null, 'Rom', 1);
Insert into Topics values (null, 'Antike Griechen', 2);

Insert into TopicPoints values (null, 'Schlacht 1', 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.', 1, now(), 1);
Insert into TopicPoints values (null, 'Schlacht 2', 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.', 1, now(), 1);
Insert into TopicPoints values (null, 'Schlacht 3', 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.', 1, now(), 1);
Insert into TopicPoints values (null, 'Schlacht 7', 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.', 2, now(), 1);
Insert into TopicPoints values (null, 'Schlacht 9', 'Lorem ipsum dolor sit amet, </br> consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.', 4, now(), 1);
Insert into TopicPoints values (null, 'Schlacht 5', 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.', 4, now(), 1);




