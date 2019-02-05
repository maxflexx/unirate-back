const PASSWORD_HASH_SALT = 'pass_salt_hash';
const crypto = require('crypto');
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
const USERS = {
  SIMPLE: {login: 'simple_user', password: crypto.createHmac('sha384', PASSWORD_HASH_SALT).update('simple_password').digest('base64'), email: 'simple@email.com', role: 0, rating: 0, profession: PROFESSIONS.SOFTWARE_DEVELOPMENT},
  SIMPLE_FGN: {login: 'not_human', password: crypto.createHmac('sha384', PASSWORD_HASH_SALT).update('not_human228').digest('base64'), email: 'hello@world.com', role: 0, rating: 100, profession: PROFESSIONS.ECONOMIST},
  ADMIN_USER: {login: 'admin_user', password: crypto.createHmac('sha384', PASSWORD_HASH_SALT).update('admin_pass').digest('base64'), email: 'admin@gmail.com', role: 1, rating: 99},
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
for (const uname in USERS) {
  const u = USERS[uname];
  console.log(`("${u.login}", "${u.password}", "${u.email}", ${u.role}, ${u.profession ? u.profession.id : null}),`)
}