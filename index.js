import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";
import env from "dotenv";

const app = express();
const port = 3000 ;
const saltRounds = 10;
env.config();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(passport.initialize());
app.use(passport.session());

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

app.get("/",(req, res) =>{
    res.render("home.ejs", { user: req.user || null });
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.get("/main" , async(req, res) =>{
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  try {
    const result = await db.query(
      "SELECT * FROM books WHERE user_id = $1 ORDER BY rating DESC",
      [req.user.id]
    );
    const books = result.rows;
    const totalLivres = books.length;
    const moyenneNote = books.length > 0 
    ? (books.reduce((acc, book) => acc + parseFloat(book.rating), 0) / books.length).toFixed(1)
    : 0;
    const totalNotes = books.filter(book => book.notes && book.notes.trim() !== '').length
    res.render("main.ejs", {
      user: req.user,
      books: result.rows,
      totalLivres: totalLivres,
      moyenneNote: moyenneNote,
      totalNotes: totalNotes
    });
  } catch (err) {
    console.log(err);
    res.redirect("/login");
  }
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/main",
    failureRedirect: "/login",
  })
);

app.post("/register", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      res.redirect("/login");
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
        } else {
          const result = await db.query(
            "INSERT INTO users (email, password, username) VALUES ($1, $2, $3) RETURNING *",
            [email, hash, username]
          );
          const user = result.rows[0];
          req.login(user, (err) => {
            console.log("success");
            res.redirect("/main");
          });
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

passport.use(
  new Strategy(async function verify(email, password, cb) {
    try {
      const result = await db.query("SELECT * FROM users WHERE email = $1 ", [
        email,
      ]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedHashedPassword = user.password;
        bcrypt.compare(password, storedHashedPassword, (err, valid) => {
          if (err) {
            //Error with password check
            console.error("Error comparing passwords:", err);
            return cb(err);
          } else {
            if (valid) {
              //Passed password check
              return cb(null, user);
            } else {
              //Did not pass password check
              return cb(null, false);
            }
          }
        });
      } else {
        return cb(null, false);
      }
    } catch (err) {
      console.log(err);
      return cb(err);
    }
  })
);

app.post("/books/add", async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/login");
    }
    const title = req.body.title;
    const auther = req.body.auther;
    const date = req.body.date;
    const isbn = req.body.isbn;
    const note = req.body.note;
    const notes = req.body.notes;
    const userId = req.user.id;
    try {
        const result = await db.query("SELECT title FROM books WHERE title = $1", [title]);
        if (result.rows.length === 0) {
            await db.query("INSERT INTO books (user_id, title, author, date_read, isbn, rating, notes) VALUES ($1, $2, $3, $4, $5, $6, $7)", [
                userId, title, auther, date || null, isbn, note, notes
            ]);
            res.redirect("/main");
        } else {
            res.send("this book you already added it");
        }
    } catch(err) {
        console.log(err);
        res.redirect("/main");
    }
});

app.post("/books/delete", async (req, res) =>{
  const id = req.body.id;
  try{
    result = await db.query("DELETE FROM books WHERE id = $1", [id]);
    res.redirect("/main");
  }catch(err){
    console.log(err);
  }
});

app.post("/books/edit", async (req, res) => {
    try {
        const { id, title, auther, date, isbn, note, notes } = req.body;
        await db.query(
            "UPDATE books SET title = $1, author = $2, date_read = $3, isbn = $4, rating = $5, notes = $6 WHERE id = $7",
            [title, auther, date || null, isbn, note, notes, id]
        );
        res.redirect("/main");
    } catch (err) {
        console.log(err);
    }
});

passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((user, cb) => {
  cb(null, user);
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});