const sqlite3 = require("sqlite3");
const { verify } = require("argon2");

const [username, password] = [].concat(process.argv).slice(2);
if (!username || !password) {
  console.error("Missing username or password");
  process.exit(1);
}

const db = new sqlite3.Database("./users.db");

const getSaltStatement = db.prepare(
  `
  SELECT salt, pass, id
  FROM user
  WHERE name = ?;
  `
);

getSaltStatement.get(username, (err, { salt, pass: hash, id }) => {
  if (err) {
    console.error(err);
    return process.exit(1);
  }
  if (!salt) {
    return console.error("No user: " + username);
  }

  verify(hash, password + salt).then((success) => {
    if (!success) {
      console.error(err);
      return process.exit(1);
    }

    console.log(id);
    process.exit(0);
  });
});
