INSERT INTO faculty (id, name, short_name) VALUES
(1, "Faculty of Informatics", "FI"),
(2, "Faculty of human science", "FGN"),
(777, "Faculty of economics", "FEN");

INSERT INTO profession (id, name, faculty_id) VALUES
(1, "software_engineering", 1),
(2, "german_philology", 2),
(3, "applied_math", 1),
(4, "economics", 777);

INSERT INTO user (login, password, email, role, profession_id) VALUES
("simple_user", "JZCtOMVHOrSgw95vuSt9lQ3igPy3yaXX9izR0I30+2r7P9/gvXsKmeYW1BajOUlg", "simple@email.com", 0, 1),
("not_human", "a59V9RZpEE6Box/2hCEPZaT/SjeK6nLlYMsDFJanW2zaJMWVaGXZxM7r762OnHVl", "hello@world.com", 0, 4),
("admin_user", "RXlqKqC5IMruddD+Sx5zcxOe+6+IzfDuYDO8c1cwrMYmZZvM9C5VelAgtlZd/jUf", "admin@gmail.com", 1, null);