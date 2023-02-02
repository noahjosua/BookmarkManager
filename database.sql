/*********************Notizen*******************************/
/* Variablen- und Tabellenbezeichnungen sind überall in der Einzahl gehalten, bitte beibehalten.*/

/* .read database.sql --- initialisiert Datenbank*/

create table user(
    userID INTEGER PRIMARY KEY autoincrement,
    username TEXT NOT NULL,
    password TEXT NOT NULL, 
    profilepicture TEXT NOT NULL
);
insert into user(username, password, profilepicture)
values("Alice", "$2a$10$tsgZGNBd08.943ocPLI.cO3VwGqi3Q5o/qV7UveMgXN45YOJ7coXS", "cat1.jpg");
/*plain pwd: Alice*12! */
insert into user(username, password, profilepicture)
values("Bob", "$2a$10$gkMxn4KIjlRM.9R1l/QQX.EQ.yoqeP3SiJqRznf0BD7R1/D8FujOC", "cat2.jpg");
/*plain pwd: s$cretB0b */
insert into user(username, password, profilepicture)
values("Carla", "$2a$10$i4Vx38sF4Mq6Mi.ARuUzS.fCcbpeA.3lOtc5HGkTOAkK0Qi0v0HrS", "cat3.jpg");
/*plain pwd: Car1aCat! */
insert into user(username, password, profilepicture)
values("David", "$2a$10$VVVMwfLzUzTTO9NJZnIly.MBqYcuixt.7YkFQ.LZ9C8KLm4yBemia", "cat4.jpg");
/*plain pwd: divaD2020! */
insert into user(username, password, profilepicture)
values("Admin", "$2a$10$pkynA7Vp3fb6XDegDwHxNuFRp/oiLt30yQsAhJphkjKC8OGsVQg2a", "admin.jpg"); 
/*plain pwd: AdminR0lf! */



create table bookmark(
    bookmarkID INTEGER PRIMARY KEY autoincrement,
    userID INTEGER NOT NULL,
    title TEXT NOT NULL,
    url TEXT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP
);
insert into bookmark(userID, title, url)
values(1, "Süße Katze", "https://www.pinterest.de/pin/321374123412881581/");
insert into bookmark(userID, title, url)
values(1, "Katze Toast", "https://www.youtube.com/watch?v=fYTkMt5Kmac");
insert into bookmark(userID, title, url)
values(1, "Niedlicher Hund", "https://www.fortune.com/2019/01/19/boo-worlds-cutest-dog-dies/");
insert into bookmark(userID, title, url)
values(1, "HAW Homepage", "https://www.haw-hamburg.de/");
insert into bookmark(userID, title, url)
values(1, "myHAW", "https://myhaw.haw-hamburg.de/");  
insert into bookmark(userID, title, url)
values(2, "Kräuter züchten", "https://www.smarticular.net/kuechenkraeuter-in-der-wohnung-ziehen/"); 
insert into bookmark(userID, title, url)
values(2, "Häkelanleitung", "https://www.youtube.com/watch?v=aAxGTnVNJiE"); 
insert into bookmark(userID, title, url)
values(2, "WrestlingHighlights", "https://www.youtube.com/watch?v=LHAHS27D-s8");  
insert into bookmark(userID, title, url)
values(3, "LoFi Beats", "https://www.youtube.com/watch?v=5qap5aO4i9A");
insert into bookmark(userID, title, url)
values(3, "Ambient", "https://www.youtube.com/watch?v=sjkrrmBnpGE");
insert into bookmark(userID, title, url)
values(3, "Fireplace", "https://www.youtube.com/watch?v=AWKzr6n0ea0"); 
insert into bookmark(userID, title, url)
values(4, "HTML für Anfänger", "https://www.w3schools.com/html/"); 
insert into bookmark(userID, title, url)
values(4, "Was ist CSS", "https://www.ionos.de/digitalguide/websites/webdesign/was-ist-css/"); 
insert into bookmark(userID, title, url)
values(4, "Sqlite", "https://www.sqlite.org/index.html"); 
insert into bookmark(userID, title, url)
values(4, "Datenbanken", "https://www.oracle.com/database/what-is-database/#:~:text=A%20database%20is%20an%20organized,database%20management%20system%20(DBMS).&text=Most%20databases%20use%20structured%20query,for%20writing%20and%20querying%20data."); 
insert into bookmark(userID, title, url)
values(4, "Node.js", "https://www.nodejs.org/en/"); 

CREATE TABLE category(
    categoryID INTEGER PRIMARY KEY autoincrement,
    userID INTEGER NOT NULL, 
    bookmarkID INTEGER NOT NULL,
    type TEXT NOT NULL
);
insert into category(userID, bookmarkID, type)
values(1, 1, "Tiere");
insert into category(userID, bookmarkID, type)
values(1, 2, "Tiere");
insert into category(userID, bookmarkID, type)
values(1, 3, "Tiere");
insert into category(userID, bookmarkID, type)
values(1, 4, "Uni");
insert into category(userID, bookmarkID, type)
values(1, 5, "Uni");
insert into category(userID, bookmarkID, type)
values(2, 6, "Garten");
insert into category(userID, bookmarkID, type)
values(2, 7, "DIY");
insert into category(userID, bookmarkID, type)
values(2, 8, "Cool");
insert into category(userID, bookmarkID, type)
values(3, 9, "Musik");
insert into category(userID, bookmarkID, type)
values(3, 10, "Musik");
insert into category(userID, bookmarkID, type)
values(3, 11, "Entspannung");
insert into category(userID, bookmarkID, type)
values(4, 12, "WebDev");
insert into category(userID, bookmarkID, type)
values(4, 13, "WebDev");
insert into category(userID, bookmarkID, type)
values(4, 14, "WebDev");
insert into category(userID, bookmarkID, type)
values(4, 15, "WebDev");
insert into category(userID, bookmarkID, type)
values(4, 16, "WebDev");


create table hashtag(
    hashtagID INTEGER PRIMARY KEY autoincrement,
    userID INTEGER NOT NULL,
    bookmarkID INTEGER NOT NULL,  
    text TEXT NOT NULL    
);
insert into hashtag(userID, bookmarkID, text)
values(1, 1, "süß");
insert into hashtag(userID, bookmarkID, text)
values(1, 1, "katze");
insert into hashtag(userID, bookmarkID, text)
values(1, 2, "lustig");
insert into hashtag(userID, bookmarkID, text)
values(1, 2, "katze");
insert into hashtag(userID, bookmarkID, text)
values(1, 3, "traurig");
insert into hashtag(userID, bookmarkID, text)
values(1, 4, "relevant");
insert into hashtag(userID, bookmarkID, text)
values(1, 5, "relevant");
insert into hashtag(userID, bookmarkID, text)
values(2, 6, "aubergine");
insert into hashtag(userID, bookmarkID, text)
values(2, 7, "mama-wo-du");
insert into hashtag(userID, bookmarkID, text)
values(2, 8, "wrestlemania");
insert into hashtag(userID, bookmarkID, text)
values(2, 8, "undertaker");
insert into hashtag(userID, bookmarkID, text)
values(2, 8, "cool");
insert into hashtag(userID, bookmarkID, text)
values(2, 8, "lol");
insert into hashtag(userID, bookmarkID, text)
values(3, 9, "mood");
insert into hashtag(userID, bookmarkID, text)
values(3, 9, "lofi");
insert into hashtag(userID, bookmarkID, text)
values(3, 10, "mood");
insert into hashtag(userID, bookmarkID, text)
values(3, 10, "ambient");
insert into hashtag(userID, bookmarkID, text)
values(3, 11, "fire");
insert into hashtag(userID, bookmarkID, text)
values(4, 12, "html");
insert into hashtag(userID, bookmarkID, text)
values(4, 12, "web");
insert into hashtag(userID, bookmarkID, text)
values(4, 13, "css");
insert into hashtag(userID, bookmarkID, text)
values(4, 13, "web");
insert into hashtag(userID, bookmarkID, text)
values(4, 14, "sqlite");
insert into hashtag(userID, bookmarkID, text)
values(4, 14, "what");
insert into hashtag(userID, bookmarkID, text)
values(4, 15, "what");
insert into hashtag(userID, bookmarkID, text)
values(4, 15, "help");
insert into hashtag(userID, bookmarkID, text)
values(4, 16, "node");



create virtual table bookmarksearch using fts5(bookmarkID, userID, title, url); 
insert into bookmarksearch select bookmarkID, userID, title, url from bookmark;  

create virtual table usersearch using fts5(userID, username, profilepicture); 
insert into usersearch select userID, username, profilepicture from user;