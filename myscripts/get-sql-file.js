const PASSWORD_HASH_SALT = 'pass_salt_hash';
const crypto = require('crypto');
function getPasswordHash(pass) {
  return crypto.createHmac('sha384', PASSWORD_HASH_SALT).update(pass).digest('base64');
}
const FACULTIES = {
  INFORMATICS: {id: 1, name: 'Faculty of Informatics', shortName: 'FI'},
  FGN: {id: 2, name: 'Faculty of human science', shortName: 'FGN'},
  FEN: {id: 777, name: 'Faculty of economics', shortName: 'FEN'}
};
const PROFESSIONS = {
  SOFTWARE_DEVELOPMENT: {id: 1, name: 'software_engineering', faculty: FACULTIES.INFORMATICS},
  GERMAN_PHILOLOGY: {id: 2, name: 'german_philology', faculty: FACULTIES.FGN},
  APPLIED_MATH: {id: 3, name: 'applied_math', faculty: FACULTIES.INFORMATICS},
  ECONOMIST: {id: 4, name: 'economics', faculty: FACULTIES.FEN}
};
const USER = {
  GRADE_FEEDBACKS1: {login: 'grade_feedbacks1', password: getPasswordHash('grade_feed11'), email: 'grade11@feedback.com', role: 0},
  GRADE_FEEDBACKS: {login: 'grade_feedbacks', password: getPasswordHash('grade_feed'), email: 'grade@feedback.com', role: 0},
  SIMPLE: {login: 'simple_user', password: getPasswordHash('simple_password'), email: 'simple@email.com', role: 0, profession: PROFESSIONS.SOFTWARE_DEVELOPMENT},
  SIMPLE_FGN: {login: 'not_human', password: getPasswordHash('not_human228'), email: 'hello@world.com', role: 0, profession: PROFESSIONS.ECONOMIST},
  ADMIN_USER: {login: 'admin_user', password: getPasswordHash('admin_pass'), email: 'admin@gmail.com', role: 1},
};


const DISCIPLINE = {
  OOP: {id: 1, name: 'OOP', year: 2, faculty: FACULTIES.INFORMATICS},
  PROCEDURE: {id: 2, name: 'Procedure programming', year: 2, faculty: FACULTIES.INFORMATICS},
  OBDZ: {id: 3, name: 'OBDZ', year: 3, faculty: FACULTIES.INFORMATICS},
  ALGORITHMS: {id: 4, name: 'Algorithms', year: 2, faculty: FACULTIES.INFORMATICS},
  ENGLISH: {id: 5, name: 'English', year: 1, faculty: FACULTIES.FGN},
  ENGLISH_LIT: {id: 6, name: 'English lit', year: 3, faculty: FACULTIES.FGN},
  ECONOMICS: {id: 7, name: 'Economics', year: 2, faculty: FACULTIES.FEN},
  HISTORY: {id: 8, name: 'History', year: 2, faculty: FACULTIES.FEN},
};

const TEACHER = {
  GULAEVA: {id: 1, name: 'Nataliya', lastName: 'Gulaeva', middleName: 'Mykhailivna'},
  BOUBLIK: {id: 2, name: 'Volodymyr', lastName: 'Boublik', middleName: 'Vasylyovych'},
  GORBORUKOV: {id: 3, name: 'Ivan', lastName: 'Gorobrukov', middleName: 'GGG'},
  USHENKO: {id: 4, name: 'Andrew', lastName: 'Ushenko', middleName: 'Ushch'},
  TOP_ECONOMIST: {id: 5, name: 'Top economist', lastName: 'The best economist', middleName: 'Godlike economist'}
};

const FEEDBACKS = {
  OOP1: {id: 1, studentGrade: 71, rating: 5, comment: 'The best OOP', created: Math.round(Date.now() / 1000), user: USER.SIMPLE, discipline: DISCIPLINE.OOP},
  OOP2: {id: 2, rating: 10, comment: 'Good oop', created: Math.round(Date.now() / 1000) - 100, updated: Math.round(Date.now() / 1000) - 50, user: USER.SIMPLE_FGN, discipline: DISCIPLINE.OOP},
  OOP3: {id: 3, rating: -5, studentGrade: 99, comment: 'BAD OOP', created: Math.round(Date.now() / 1000) + 1, user: USER.SIMPLE_FGN, discipline: DISCIPLINE.OOP},
  OBDZ1: {id: 4, rating: 100, studentGrade: 100, comment: 'IZI', created: Math.round(Date.now() / 1000) - 61, updated: Math.round(Date.now() / 1000) - 50, user: USER.SIMPLE, discipline: DISCIPLINE.OBDZ},
  OBDZ2: {id: 5, rating: 50, comment: 'LOL OBDZ', created: Math.round(Date.now() / 1000), user: USER.SIMPLE_FGN, discipline: DISCIPLINE.OBDZ},
  PROCEDURE1: {id: 6, rating: 20, comment: 'Procedure ok', created: Math.round(Date.now() / 1000), user: USER.SIMPLE, discipline: DISCIPLINE.PROCEDURE}
};

const FEEDBACK_TEACHER = {
  BOUBLIK_OOP1: {feedback: FEEDBACKS.OOP1, teacher: TEACHER.BOUBLIK},
  GORBORUKOV_OOP1: {feedback: FEEDBACKS.OOP1, teacher: TEACHER.GORBORUKOV},
  BOUBLIK_OOP2: {feedback: FEEDBACKS.OOP2, teacher: TEACHER.BOUBLIK},
  BOUBLIK_OOP3: {feedback: FEEDBACKS.OOP3, teacher: TEACHER.BOUBLIK},
  BOUBLIK_PROCEDURE1: {feedback: FEEDBACKS.PROCEDURE1, teacher: TEACHER.BOUBLIK},
  GULAEVA_OBDZ1: {feedback: FEEDBACKS.OBDZ1, teacher: TEACHER.GULAEVA},
  GULAEVA_OBDZ2: {feedback: FEEDBACKS.OBDZ2, teacher: TEACHER.GULAEVA},
  USHENKO_OBDZ2: {feedback: FEEDBACKS.OBDZ2, teacher: TEACHER.USHENKO},
};

const FEEDBACK_GRADE = {
  OOP1: {id: 1, like: 1, feedback: FEEDBACKS.OOP1, user: USER.GRADE_FEEDBACKS},
  OOP1_1: {id: 2, like: 1, feedback: FEEDBACKS.OOP1, user: USER.GRADE_FEEDBACKS1},
  OOP3: {id: 3, like: 1, feedback: FEEDBACKS.OOP3, user: USER.GRADE_FEEDBACKS1},
  OOP3_1: {id: 4, like: 0, feedback: FEEDBACKS.OOP3, user: USER.SIMPLE},
  OBDZ: {id: 5, like: 1, feedback: FEEDBACKS.OOP1, user: USER.GRADE_FEEDBACKS}
};

console.log('INSERT INTO faculty (id, name, short_name) VALUES');
for (const fname in FACULTIES) {
  const f = FACULTIES[fname];
  console.log(`(${f.id}, "${f.name}", "${f.shortName}"),`);
}

console.log('INSERT INTO profession (id, name, faculty_id) VALUES ');
for (const pname in PROFESSIONS) {
  const p = PROFESSIONS[pname];
  console.log(`(${p.id}, "${p.name}", ${p.faculty.id}),`)
}

console.log('INSERT INTO user (login, password, email, role, profession_id) VALUES ');
for (const uname in USER) {
  const u = USER[uname];
  console.log(`("${u.login}", "${u.password}", "${u.email}", ${u.role}, ${u.profession ? u.profession.id : null}),`)
}


console.log('INSERT INTO discipline (id, name, year, faculty_id) VALUES ');
for (const key in DISCIPLINE) {
  console.log(`(${DISCIPLINE[key].id}, "${DISCIPLINE[key].name}", ${DISCIPLINE[key].year}, ${DISCIPLINE[key].faculty.id}),`);
}


console.log('INSERT INTO teacher (id, name, last_name, middle_name) VALUES ');
for (const key in TEACHER) {
  console.log(`(${TEACHER[key].id}, "${TEACHER[key].name}", "${TEACHER[key].lastName}", "${TEACHER[key].middleName}"),`);
}


console.log('INSERT INTO feedback (id, student_grade, rating, comment, created, updated, user_login, discipline_id) VALUES ');
for (const key in FEEDBACKS) {
  console.log(`(${FEEDBACKS[key].id}, ${FEEDBACKS[key].studentGrade || null}, ${FEEDBACKS[key].rating}, "${FEEDBACKS[key].comment}", ${FEEDBACKS[key].created}, ${FEEDBACKS[key].updated || 0}, "${FEEDBACKS[key].user.login}", ${FEEDBACKS[key].discipline.id}),`);
}


console.log('INSERT INTO feedback_teacher (feedback_id, teacher_id) VALUES ');
for (const key in FEEDBACK_TEACHER) {
  console.log(`(${FEEDBACK_TEACHER[key].feedback.id}, ${FEEDBACK_TEACHER[key].teacher.id});`);
}


console.log('INSERT INTO feedback_grade (id, like, feedback_id, user_login) VALUES ');
for (const key in FEEDBACK_GRADE) {
  console.log(`(${FEEDBACK_GRADE[key].id}, ${FEEDBACK_GRADE[key].like}, ${FEEDBACK_GRADE[key].feedback.id}, "${FEEDBACK_GRADE[key].user.login}"),`);
}