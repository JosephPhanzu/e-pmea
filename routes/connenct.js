const express = require("express");
const multer = require('multer');
const upload = multer();
const router = express.Router();

router.post('/login', upload.none(), (req, res) => {

    const { email, matricule } = req.body;

    if (email != "" && matricule != "") {

        const query = 'SELECT * FROM users WHERE email = ? AND matricule = ?';
        req.optionBdd.query(query, [email, matricule], (erreur, resultat) => {
            if (erreur) {
                console.log(erreur);
                return res.status(500).send('Erreur de connexion à la base de données');
            }
            if (resultat.length > 0) {
                // Créer une session pour l'utilisateur
                req.session.user = {
                    id: resultat[0].id_user, // Exemple d'ID utilisateur, ajustez selon votre table
                    email: resultat[0].email,
                    fonction : resultat[0].fonction
                };
                console.log('Session user:', req.session.user);
                res.json({message : 'Reussi', data : email});
            } else {
                res.json({message : 'Identifiants incorrects!!!', data : email});
                console.log('Identifiants incorrects');
            }
        });
    }else{
        res.json({message : 'Les champs sont vide'});
        console.log('Les champs sont vide');
    }
});

module.exports = router;