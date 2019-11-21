SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS teacher;
CREATE TABLE teacher (
	id bigint NOT NULL AUTO_INCREMENT,
    name varchar(20) NOT NULL,
    last_name varchar(30) NOT NULL,
    middle_name varchar(20) NOT NULL,
    PRIMARY KEY(id)
);

INSERT INTO teacher (id, name, last_name, middle_name) VALUES
(1, "Nataliya", "Gulaeva", "Mykhailivna"),
(2, "Volodymyr", "Boublik", "Vasylyovych"),
(3, "Ivan", "Gorobrukov", "GGG"),
(4, "Andrew", "Ushenko", "Ushch");

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
INSERT INTO feedback_grade (id, `like`, feedback_id, user_login) VALUES
(1, 1, 1, "grade_feedbacks"),
(2, 1, 1, "grade_feedbacks1"),
(3, 1, 3, "grade_feedbacks1"),
(4, 0, 3, "simple_user"),
(5, 1, 1, "grade_feedbacks");

DROP TABLE IF EXISTS feedback_teacher;
CREATE TABLE feedback_teacher (
	feedback_id bigint NOT NULL,
    teacher_id bigint NOT NULL,
    PRIMARY KEY(feedback_id, teacher_id),
    FOREIGN KEY(feedback_id)
		REFERENCES feedback(id),
	FOREIGN KEY(teacher_id)
		REFERENCES teacher(id));

INSERT INTO feedback_teacher (feedback_id, teacher_id) VALUES
(1, 2),
(1, 3),
(2, 2),
(3, 2),
(6, 2),
(4, 1),
(5, 1),
(5, 4);

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
        ON DELETE CASCADE);

INSERT INTO feedback (id, student_grade, rating, comment, created, updated, user_login, discipline_id) VALUES
(1, 71, 5, "The best OOP", 1550096124, 0, "simple_user", 1),
(2, null, 10, "Good oop", 1550096024, 1550096074, "not_human", 1),
(3, 99, -5, "BAD OOP", 1550096125, 0, "not_human", 1),
(4, 100, 100, "IZI", 1550096063, 1550096074, "simple_user", 3),
(5, null, 50, "LOL OBDZ", 1550096124, 0, "not_human", 3),
(6, null, 20, "Procedure ok", 1550096124, 0, "simple_user", 2);

DROP TABLE IF EXISTS discipline;
CREATE TABLE discipline(
	id bigint NOT NULL AUTO_INCREMENT,
    name varchar(64) NOT NULL,
    `year` tinyint(1) NOT NULL,
    faculty_id bigint NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(faculty_id)
		REFERENCES faculty(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
INSERT INTO faculty (id, name, short_name) VALUES 
(1, "Faculty of Informatics", "FI"), 
(2, "Faculty of human studies", "FGN");

INSERT INTO profession (id, name, faculty_id) VALUES 
(1, "IPZ", 1), 
(2, "German Philosophy", 2)


INSERT INTO discipline (id, name, year, faculty_id) VALUES
(1, "OOP", 2, 1),
(2, "Procedure programming", 2, 1),
(3, "OBDZ", 3, 1),
(4, "Algorithms", 2, 1),
(5, "English", 1, 2),
(6, "English lit", 3, 2),
(7, "Economics", 2, 777),
(8, "History", 2, 777);


DROP TABLE IF EXISTS mandatory;
CREATE TABLE mandatory (
    discipline_id bigint NOT NULL,
    profession_id bigint NOT NULL,
    PRIMARY KEY(discipline_id,profession_id),
    FOREIGN KEY(discipline_id)
        REFERENCES discipline(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY(profession_id)
        REFERENCES profession(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

INSERT INTO mandatory (discipline_id, profession_id) VALUES
(3, 1),
(1, 1),
(7, 4),
(5, 4),
(5, 1);

SET FOREIGN_KEY_CHECKS = 1;
