//Initialisierung Express
const express = require("express");
const app = express();

//Initialisierung Body-Parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

//Initialisierung EJS
app.engine(".ejs", require("ejs").__express);
app.set("view engine", "ejs");

//Initialisierung sqlite3 Datenbank
const DATABASE = "data.db";
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(DATABASE);

//Initialisierung express-fileupload
const fileUpload = require("express-fileupload");
app.use(fileUpload());

//Initialisierung Cookies
const cookieParser = require("cookie-parser");
app.use(cookieParser());

//Cookie lesen 
app.get('/', function(req, res) {
    let counter = parseInt(req.cookies['counter']) || 0;
});

//Cookie schreiben 
app.get('/', function(req, res) {
    res.cookie('counter', counter + 1, { 'maxAge': maxAge });
});

//Initialisierung Session
const session = require("express-session");
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 3600 * 1000 }
}));

const path = require("path");
const { runInNewContext } = require("vm");
const { profile } = require("console");

//Password-Hashing
const bcrypt = require('bcryptjs');
const { type } = require("os");

//Ordner, die freigegeben werden sollen 
app.use(express.static(__dirname + "/public"));

//Server starten
app.listen(3000, function() {
    console.log("listening on 3000");
});

////////// GET Requests //////////
app.get("/start", function(req, res) {
    db.all(`select title, url from bookmark`, function(err, rows) {
        res.render("start", { "bookmark": rows });
    });
});

app.get("/login", function(req, res) {
    res.render("login", { error: "" });
});

app.get("/logout", function(req, res) {
    req.session.loggedin = false;
    res.redirect("/start");
});

app.get("/registration", function(req, res) {
    res.render("registration", { error: "" });
});

app.get("/mypage", function(req, res) {
    if (req.session.loggedin) {
        const username = req.session.username;
        const profilepicture = req.session.picture;
        GetBookmarks(username, function(rows) {
            req.session.rows = rows;
            res.render("mypage", { error: "", username: username, picture: profilepicture, "bookmarks": rows });
        });
    } else {
        res.render("login", { error: "Du musst angemeldet sein, um deine Seite zu besuchen." });
    }
});

app.get("/newbookmark", function(req, res) {
    if (req.session.loggedin) {
        res.render("newbookmark");
    } else {
        res.render("login", { error: "Bitte melde dich an, um eine Bookmark anzulegen." });
    }
});

app.get("/userOverview", function(req, res) {
    if (req.session.loggedin) {
        db.all(`select userID, username, profilepicture from user`, function(err, rows) {
            res.render("userOverview", { error: "", "user": rows });
        });
    } else {
        res.render("login", { error: "Du musst als Admin angemeldet sein, um die geforderten Inhalte zu sehen." });
    }
});

app.get("/details/:id", function(req, res) {
    if (req.session.loggedin) {
        const index = req.params.id;
        GetBookmarks2(index, function(rows) {
            req.session.rows = rows;
            res.render("userDetails", { "bookmarks": rows });
        });
    } else {
        res.render("login", { error: "Du musst als Admin angemeldet sein, um die geforderten Inhalte zu sehen." });
    }
});

////////// POST Requests //////////
function GetBookmarks(username, callback) {
    db.all(`select bookmark.userID, bookmark.title, bookmark.url, category.type,
            bookmark.bookmarkID from bookmark left join category on category.bookmarkID = bookmark.bookmarkID
            where bookmark.userID in(select userID from user where username = '${username}')`, function(err, rows) {

        db.all(`select * from hashtag`, function(err, hashtags_rows) {
            for (let i = 0; i < rows.length; i++) {
                let hashtags = []
                for (let j = 0; j < hashtags_rows.length; j++) {
                    if (hashtags_rows[j].bookmarkID === rows[i].bookmarkID) {
                        hashtags.push(hashtags_rows[j].text);
                    }
                }
                rows[i].hashtags = hashtags;
            }
            callback(rows);
        });
    });
}

function GetBookmarks2(index, callback) {
    db.all(`select bookmark.userID, bookmark.title, bookmark.url, category.type, bookmark.bookmarkID from bookmark left join category on category.bookmarkID = bookmark.bookmarkID where bookmark.userID = '${index}'`, function(err, rows) {
        db.all(`select * from hashtag`, function(err, hashtags_rows) {
            for (let i = 0; i < rows.length; i++) {
                let hashtags = []
                for (let j = 0; j < hashtags_rows.length; j++) {
                    if (hashtags_rows[j].bookmarkID === rows[i].bookmarkID) {
                        hashtags.push(hashtags_rows[j].text);
                    }
                }
                rows[i].hashtags = hashtags;
            }
            callback(rows);
        });
    });
}

//Login
app.post("/mypage", function(req, res) {
    const username = req.body.username;
    const plainpassword = req.body.password;
    let profilepicture;

    if (username == "Admin" && plainpassword == "AdminR0lf!") {
        req.session.loggedin = true;
        db.all(`select userID, username, profilepicture from user`, function(err, rows) {
            res.render("userOverview", { error: "", "user": rows });
        });
    } else {
        db.all(`select * from user where username = '${username}'`, function(err, rows) {
            if (rows.length < 1) {
                res.render("login", { error: "Benutzername existiert nicht." });
            } else {
                bcrypt.compare(plainpassword, rows[0]["password"], function(err, result) {
                    if (!result) {
                        res.render("login", { error: "Passwort falsch." });
                    } else {
                        profilepicture = rows[0]["profilepicture"];
                        req.session.loggedin = true;
                        req.session.username = username;
                        req.session.picture = profilepicture;
                        GetBookmarks(username, function(rows) {
                            req.session.rows = rows;
                            res.render("mypage", { error: "", username: username, picture: profilepicture, "bookmarks": rows });
                        });
                    }
                });
            }
        });
    }
});

//Benutzer hinzufügen
app.post("/addUser", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.confirmpassword;

    db.all(`select * from user where username = '${username}'`, function(err, rows) {
        if (rows.length > 0) {
            res.render("registration", { error: "Benutzername schon vergeben." });
        } else {
            if (password == password2) {
                bcrypt.hash(password, 10, (err, hash) => {
                    if (err) {
                        throw err;
                    }
                    
                    console.log(req.files);
                    const file = req.files.filename;
                    const now = new Date();
                    const newFilename = now.valueOf() + "_" + file.name;
                    file.mv(__dirname + "/public/images/profilepics/" + newFilename);

                    db.run(`insert into user(username, password, profilepicture) values("${username}", "${hash}", "${newFilename}")`, function(err) {
                        db.run(`insert into usersearch(userID, username, profilepicture) values((select userID from user where username = '${username}'), "${username}", (select profilepicture from user where username = '${username}'))`, function(err) {
                            console.log(err);
                            db.run(`insert into bookmark(userID, title, url) values((select userID from user where username = '${username}'), "Herzlich Willkommen", "https://www.haw-hamburg.de")`, function(err) {});
                        });
                    });
                    res.redirect("/login");
                });
            }
        }
    });
});

//NewBookmark anlegen 
app.post("/onupload", function(req, res) {
    req.session.loggedin = true;
    const username = req.session.username;
    const profilepicture = req.session.picture;

    let title = req.body.title;
    let url = req.body.url;
    let type = req.body.category;
    let text = req.body.hashtag;

    db.run(`insert into bookmark (userID, title, url) values((select userID from user where username = '${username}'), "${title}", "${url}")`, function(err) {
        db.run(`insert into bookmarksearch(bookmarkID, userID, title, url) values((select bookmarkID from bookmark where userID in(select userID from user where username="${username}") and title="${title}" and url="${url}"), (select userID from user where username = '${username}'), "${title}", "${url}")`, function(err) {
            db.run(`insert into category(userID, bookmarkID, type) values((select userID from user where username = '${username}'),(select bookmarkID from bookmark where(userID, title, url) in(select user.userID, title, url from user, bookmark where user.username = '${username}' and bookmark.title = "${title}" and bookmark.url = "${url}")), "${type}")`, function(err) {
                db.run(`insert into hashtag(userID, bookmarkID, text) values((select userID from user where username = '${username}'),(select bookmarkID from bookmark where(userID, title, url) in(select user.userID, title, url from user, bookmark where user.username = '${username}' and bookmark.title = "${title}" and bookmark.url = "${url}")), "${text}")`, function(err) {
                    GetBookmarks(username, function(rows) {
                        req.session.rows = rows;
                        res.render("mypage", { error: "", username: username, picture: profilepicture, "bookmarks": rows });
                    });
                });
            });
        });
    });
});

//Bookmarksearch 
app.post("/search", function(req, res) {
    req.session.loggedin = true;
    const username = req.session.username;
    const userinput = req.body.bookmarksearch;
    const profilepicture = req.session.picture;

    db.all(`select * from bookmarksearch where title like '%${userinput}%' and bookmarksearch.userID in(select userID from user where username = '${username}') order by rank`, function(err, rows) {
        if (rows.length < 1) {
            GetBookmarks(username, function(rows) {
                req.session.rows = rows;
                res.render("mypage", { error: "Kein Treffer.", username: username, picture: profilepicture, "bookmarks": rows });
            });
        } else {
            res.render("searchResult", { error: "", "bookmarksearch": rows });
        }
    });
});

//Usersearch -- Admin
app.post("/usersearch", function(req, res) {
    req.session.loggedin = true;
    const input = req.body.usersearch;

    db.all(`select * from usersearch where usersearch match '${input}*' order by rank`, function(err, rows) {
        if (rows < 1) {
            db.all(`select userID, username, profilepicture from user`, function(err, rows) {
                res.render("userOverview", { error: "Kein Treffer.", "user": rows });
            });
        } else {
            res.render("result", { error: "", "usersearch": rows });
        }
    });
});

//Bookmark löschen 
app.post("/delete/:id", function(req, res) {
    const loggedin = req.session.loggedin;
    if (loggedin) {
        db.all(`select bookmark.title, bookmark.url, category.type, hashtag.text from bookmark left join category on category.bookmarkID = bookmark.bookmarkID left join hashtag on hashtag.bookmarkID = bookmark.bookmarkID where bookmark.bookmarkID=${req.params.id}`, function(err, rows) {
            console.log(err);
            console.log(rows);
            db.run(`delete from bookmark where bookmarkID=${req.params.id}`, function(err) {
                db.run(`delete from category where bookmarkID=${req.params.id}`, function(err) {
                    db.run(`delete from hashtag where bookmarkID=${req.params.id}`, function(err) {
                        db.run(`delete from bookmarksearch where bookmarkID=${req.params.id}`, function(err) {
                            console.log(err);
                            const username = req.session.username;
                            const profilepicture = req.session.picture;
                            GetBookmarks(username, function(rows) {
                                res.render("mypage", { error: "", username: username, picture: profilepicture, "bookmarks": rows });
                            });
                        });
                    });
                });
            });
        });
    } else { res.render("login", { error: "Du musst angemeldet sein, um diese Aktion durchzuführen." }); }
});

//Bookmark ändern
app.post("/update/:id", function(req, res) {
    const loggedin = req.session.loggedin;
    if (loggedin) {
        db.all(`select bookmark.bookmarkID as bookmarkID, bookmark.title as title, bookmark.url as url, category.type as type, hashtag.text as text from bookmark left join category on category.bookmarkID = bookmark.bookmarkID left join hashtag on hashtag.bookmarkID = bookmark.bookmarkID where bookmark.bookmarkID=${req.params.id}`, function(err, rows) {
            req.session.rows = rows;
            res.render("update", { "bookmarks": rows });
        });
    } else { res.render("login", { error: "Du musst angemeldet sein, um diese Aktion durchzuführen." }); }
});

app.post("/onupdate/:id", function(req, res) {
    const loggedin = req.session.loggedin;
    const newtitle = req.body.title;
    const newcategory = req.body.category;
    const newurl = req.body.url;
    const newhashtag = req.body.hashtag;

    if (loggedin) {
        db.run(`update bookmark set title="${newtitle}", url="${newurl}" where bookmarkID=${req.params.id}`, function(err) {
            db.run(`update bookmarksearch set title="${newtitle}", url="${newurl}" where bookmarkID=${req.params.id}`, function(err) {});
            db.run(`update category set type="${newcategory}" where bookmarkID=${req.params.id}`, function(err) {
                db.run(`update hashtag set text="${newhashtag}" where bookmarkID=${req.params.id}`, function(err) {
                    const username = req.session.username;
                    const profilepicture = req.session.picture;
                    GetBookmarks(username, function(rows) {
                        res.render("mypage", { error: "", username: username, picture: profilepicture, "bookmarks": rows });
                    });
                });
            });
        });
    } else { res.render("login", { error: "Du musst angemeldet sein, um diese Aktion durchzuführen." }); }
});