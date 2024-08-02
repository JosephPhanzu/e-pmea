require("dotenv").config();
const express = require('express');
const http = require("http");
const mySql = require("mysql");
var path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const app = express();

const optionBdd = mySql.createConnection({
    host : process.env.DB_HOST || 'localhost',
    port : process.env.DB_PORT || 3306,
    database : process.env.DB_NAME || 'e-pmea',
    user : process.env.DB_USER || 'root',
    password : process.env.DB_PASS || ''
});

//  Établir la connexions
optionBdd.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données:'+ err);
        return;
    }
    console.log('Connecté à la base de données MySQL.');
});

// Ajouter la connexion à `req` pour les routes
app.use((req, res, next) => {
    req.optionBdd = optionBdd;
    next();
});

//Configuration du store de sessions MySQL
const sessionStore = new MySQLStore({}, connection);

// Configuration de la session avec MySQL
app.use(session({
  key: 'session_cookie_name',
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true } // Mettre `true` en production avec HTTPS
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

// Route pour afficher la page d'accueil
app.get('/', (req, res) => {
    if (req.session.user) {
        req.session.destroy();
    }
    res.status(200).render('login');
});

// Route pour afficher la page d'accueil après la connexion réussie
app.get('/accueil', (req, res) => {
    if (req.session.user) {
        res.render('accueil');
    } else {
        res.redirect('/');
    }
});

app.get('/fiche', (req, res) => {
    if (req.session.user) {
        const fonction_user = req.session.user.fonction;
        res.render('fiche', {fonction_user});
    }else{
        res.status(300).redirect('/');
    }
});

app.get('/recensement', (req, res) => {
    console.log('Session user dans /recensement:', req.session.user);
    if (req.session.user) {
        const id_user = req.session.user.id;
        res.status(200).render('recensement', { id_user});
    }else{
        res.status(300).redirect('/');
    }
});

app.get('/fpatente', (req, res) => {
    console.log('Session user dans /addpatente:', req.session.user);
    if (req.session.user) {
        const id_user = req.session.user.id;
        const paramUrl = req.query.type;
        res.status(200).render('fpatente', { id_user, paramUrl});
    }else{
        res.status(300).redirect('/');
    }
});

app.get('/list', (req, res) => {
    console.log('Session user dans /addpatente:', req.session.user);
    if (req.session.user) {
        const id_user = req.session.user.id;
        const fonction_user = req.session.user.fonction;
        res.status(200).render('list', { id_user, fonction_user});
    }else{
        res.status(300).redirect('/');
    }
});

app.get('/ajoutAgent', (req, res) => {
    console.log('Session user dans /addpatente:', req.session.user);
    if (req.session.user) {
        const id_user = req.session.user.id;
        res.status(200).render('ajoutAgent', { id_user});
    }else{
        res.status(300).redirect('/');
    }
});

// Définition du routes middlaware pour la connexion
const connexionPage = require("./routes/connenct");
app.use('/connect', connexionPage);

// Définition du routes pour l'ajout de recensement
const addrece = require("./routes/ajoutrecensement");
app.use('/addrece', addrece);

// Définition du routes pour l'ajout de recensement
const addpatente = require("./routes/ajoutpatente");
app.use('/addpatente', addpatente);

// Définition du routes pour l'affichage des listes
const listPat = require("./routes/list");
app.use('/list', listPat);

// Définition du routes pour la deconnexion
const deconnexionPage = require("./routes/deconnexion");
const { truncate } = require("fs/promises");
app.use('/deconnect', deconnexionPage);

// Configuration du serveur
app.set('port', process.env.PORT || 3000);
app.set('host', process.env.HOST);

http.createServer(app).listen(app.get('port'),app.get('host'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});