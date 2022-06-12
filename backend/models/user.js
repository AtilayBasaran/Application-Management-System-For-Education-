const db = require('../util/database');
var dateTime = require('node-datetime');

module.exports = class User {
  constructor(firstname, lastname, email, password,register_date, is_delete) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.password = password;
    this.register_date = register_date;
    this.is_delete = is_delete;
    this.role = 'student';
    
  }

  static find(email) {
    return db.execute('SELECT * FROM users WHERE email = ?', [email]);
  }

  static save(user) {
    var dt = dateTime.create();
    var formatted = dt.format('Y-m-d H:M:S');


    return db.execute(
      'INSERT INTO users (firstname, lastname, email, password, register_date, is_delete, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [user.firstname, user.lastname, user.email, user.password, formatted, false, 'student']
    );
  }
};
