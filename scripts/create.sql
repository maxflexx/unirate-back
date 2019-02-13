SET FOREIGN_KEY_CHECKS = 0;
#faculty
DROP TABLE IF EXISTS faculty;
CREATE TABLE faculty(
	id bigint NOT NULL AUTO_INCREMENT,
    name varchar(64) NOT NULL,
    short_name varchar(8) NOT NULL,
    PRIMARY KEY(id)
);

#professions
DROP TABLE IF EXISTS profession;
CREATE TABLE profession(
	id bigint NOT NULL AUTO_INCREMENT,
    name varchar(64) NOT NULL,
    faculty_id bigint NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(faculty_id)
		REFERENCES faculty(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

#discipline
DROP TABLE IF EXISTS discipline;
CREATE TABLE discipline(
	id bigint NOT NULL AUTO_INCREMENT,
    name varchar(64) NOT NULL,
    mandatory tinyint(1) NOT NULL,
    `year` tinyint(1) NOT NULL,
    faculty_id bigint NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(faculty_id)
		REFERENCES faculty(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

#user
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`(
	login varchar(32) NOT NULL,
    password varchar(128) NOT NULL,
    email varchar(64) NOT NULL,
    role tinyint(1) NOT NULL DEFAULT 0,
    rating smallint NOT NULL DEFAULT 0,
    profession_id bigint,
    PRIMARY KEY(login),
    FOREIGN KEY(profession_id)
		REFERENCES profession(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

#feedback
DROP TABLE IF EXISTS feedback;
CREATE TABLE feedback (
	id bigint NOT NULL AUTO_INCREMENT,
    student_grade tinyint(1),
    rating int NOT NULL DEFAULT 0,
    `comment` varchar(2048) NOT NULL,
    created int NOT NULL,
    updated int,
    user_login varchar(32) NOT NULL,
    discipline_id bigint NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(user_login)
		REFERENCES `user`(login)
        ON UPDATE CASCADE,
    FOREIGN KEY(discipline_id)
		REFERENCES discipline(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

#teacher
DROP TABLE IF EXISTS teacher;
CREATE TABLE teacher (
	id bigint NOT NULL AUTO_INCREMENT,
    name varchar(20) NOT NULL,
    last_name varchar(30) NOT NULL,
    middle_name varchar(20) NOT NULL,
    PRIMARY KEY(id)
);

#feedback_teacher
DROP TABLE IF EXISTS feedback_teacher;
CREATE TABLE feedback_teacher (
	feedback_id bigint NOT NULL,
    teacher_id bigint NOT NULL,
    PRIMARY KEY(feedback_id, teacher_id),
    FOREIGN KEY(feedback_id)
		REFERENCES feedback(id),
	FOREIGN KEY(teacher_id)
		REFERENCES teacher(id)

#feedback_grade
DROP TABLE IF EXISTS feedback_grade;
CREATE TABLE feedback_grade (
	id bigint NOT NULL AUTO_INCREMENT,
    `like` tinyint(1) NOT NULL,
    feedback_id bigint NOT NULL,
    user_login varchar(32) NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(feedback_id)
		REFERENCES feedback(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY(user_login)
		REFERENCES `user`(login)
		ON UPDATE CASCADE
);

SET FOREIGN_KEY_CHECKS = 1;