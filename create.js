const sqlite3 = require("sqlite3");
const { hash } = require("argon2");
const csprng = require("csprng");

const [username, password] = [].concat(process.argv).slice(2);
if (!username || !password) {
  console.error("Missing username or password");
  process.exit(1);
}

const db = new sqlite3.Database("./users.db");

const salt = csprng(32, 8);

hash(password + salt).then((hash) => {
  console.log({ username, salt, password, hash });
  db.prepare(
    `
    INSERT INTO user
    (name, salt, pass)
    VALUES (?,?,?);
    `
  ).run(username, salt, hash, (err) => {
    if (err) {
      console.error(err);
      return process.exit(2);
    }
    process.exit(0);
  });
});
