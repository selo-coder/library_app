SELECT * FROM User;

SELECT * FROM UserCommentUpvotes;

SELECT * FROM UserComments;

SELECT * FROM TopicPoints;

SELECT * FROM Topics;

DELETE FROM UserCommentUpvotes WHERE find_in_set(userCommentId, );

SELECT uc.userCommentId, concat(u.firstName,' ', u.lastName) as name, uc.comment, count(ucv.userCommentId) as upvoteCount, uc.createdAt FROM UserComments uc INNER JOIN TopicPoints tp ON tp.topicPointId = uc.topicPointId LEFT JOIN UserCommentUpvotes ucv ON uc.userCommentId = ucv.userCommentId INNER JOIN User u ON u.id = uc.userId WHERE uc.topicPointId = 1 group by uc.userCommentId;

SELECT t.topicId, t.topicTitle, count(*) FROM Topics t LEFT JOIN TopicPoints tp ON t.topicId = tp.topicId where t.topicId = (SELECT topicId FROM TopicPoints WHERE topicPointId = 7) group by t.topicId;

SELECT id, concat(firstName, ' ', lastName) FROM User ;

SELECT * FROM User u LEFT JOIN TopicPoints tp ON tp.createdBy = u.id;

UPDATE TopicPoints SET topicPointTitle = 'JOOO', createdAt = now() WHERE topicPointId = 2;



SELECT * FROM User u LEFT JOIN (SELECT createdBy, MAX(createdAt) FROM TopicPoints group by createdBy) tp ON tp.createdBy = u.id; 

SELECT * FROM FavoriteTopicPoints;

UPDATE TopicPoints SET content = 'empty' WHERE topicPointId = 1;

DELETE FROM TopicPoints WHERE topicPointId=20;

SELECT t.topicId, t.topicTitle, count(*) FROM  Topics t LEFT JOIN TopicPoints tp ON t.topicId = tp.topicId where t.topicId = (SELECT topicId FROM TopicPoints WHERE topicPointId = 10);

SELECT * FROM TopicPoints WHERE createdBy = 2;

SELECT * FROM TopicPoints tp INNER JOIN Topics t ON tp.topicId = t.topicId INNER JOIN Subjects s ON s.subjectId = t.subjectId WHERE tp.createdBy = 2;


SELECT * FROM FavoriteTopicPoints ftp INNER JOIN TopicPoints tp ON tp.topicPointId = ftp.topicPointId AND ftp.userId = 3 INNER JOIN Topics t ON tp.topicId = t.topicId INNER JOIN Subjects s ON s.subjectId = t.subjectId order by s.subjectId;

SELECT s.subjectId FROM FavoriteTopicPoints ftp INNER JOIN TopicPoints tp ON tp.topicPointId = ftp.topicPointId AND ftp.userId = 2 INNER JOIN Topics t ON tp.topicId = t.topicId INNER JOIN Subjects s ON s.subjectId = t.subjectId group by s.subjectId order by s.subjectId;


SELECT tp.topicPointTitle, tp.content, tp.createdAt, (select concat(firstName,' ', lastName) from User where id = tp.createdBy) as createdBy, t.topicTitle, s.subjectId, s.subjectTitle FROM FavoriteTopicPoints ftp INNER JOIN TopicPoints tp ON tp.topicPointId = ftp.topicPointId INNER JOIN Topics t ON t.topicId = tp.topicId INNER JOIN Subjects s ON s.subjectId = t.subjectId WHERE ftp.userId = 2;

SELECT * FROM TopicPoints tp INNER JOIN Topics t ON tp.topicId = t.topicId INNER JOIN Subjects s ON s.subjectId = t.subjectId WHERE tp.topicPointTitle = 'Schlacht 1' AND tp.topicId = 3 AND t.subjectId = 1;

SELECT * FROM FavoriteTopicPoints WHERE topicPointId = 10 AND userId = 2;

SELECT tp.topicPointTitle, t.topicTitle FROM FavoriteTopicPoints ftp INNER JOIN TopicPoints tp ON tp.topicPointId = ftp.topicPointId INNER JOIN Topics t ON t.topicId = tp.topicId INNER JOIN Subjects s ON s.subjectId = t.subjectId WHERE ftp.userId = 2  AND t.subjectId = 1;