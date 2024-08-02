const express = require("express");
const multer = require('multer');
const path = require('path');
// const { body, validationResult } = require('express-validator');

const router = express.Router();

// Configuration de multer pour le stockage des fichiers
const temps = Date.now();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/fichierUploade/fpatente/'); // Répertoire de destination
    },
    filename: (req, file, cb) => {
        cb(null, 'GST_' + temps + path.extname(file.originalname)); // Nom du fichier
    }
});

const upload = multer({ storage : storage });

router.post('/ajoutpatent', upload.single('file'), (req, res) => {
    const file = req.file;
    const { 
        nom, nature, denomination, categorie, email, tel, avenu_acti, numero_acti, quartier_acti,
        commune_acti, avenu_resi, numero_resi, quartier_resi, commune_resi, taux, penalite, type_pat, id_user
    } = req.body;

    fichier = 'fichierUploade/fpatente/GST_' + temps + path.extname(file.originalname);

    if (!file) {
        res.json({message : 'Aucun fichier téléchargé'});
        console.error('Aucun fichier téléchargé');
    }else{
        // Requête pour insérer les données dans la base de données
        let sql = 'SELECT * FROM patentecom WHERE denomination = ? AND email = ?';
        req.optionBdd.query(sql, [denomination, email], (err, result) => {
            if (err) {
                console.error('Erreur lors de la recupération des données '+ id_user +':', err);
                res.json({message : 'Erreur lors de la recupération des '+ id_user +' '+ err});
            }
            if (result.lenght > 0) {
                res.json({message : 'Cette Entreprise existe déjà'});
            }else{

                sql = 'INSERT INTO patentecom (nom, nature, denomination, categorie, av_actiP, num_actiP, quertier_actP, commune_actiP, email, tel, av_resiP, num_resiP, quartier_resiP, commune_resiP, taux, penalite, typePat, photo, id_user) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
                req.optionBdd.query(sql, [nom, nature, denomination, categorie, avenu_acti, numero_acti, quartier_acti, commune_acti, email, tel, avenu_resi, numero_resi, quartier_resi, commune_resi, taux, penalite,type_pat, fichier, id_user], (err, result) => {
                    if (err) {
                        console.error('Erreur lors de l\'insertion des données '+ id_user +':', err);
                        res.json({message : 'Erreur lors de l\'enregistrement '+ id_user +' '+ err});
                    }
                    res.json({message : 'Enregistrement éffectue'});
                    console.error('Enregistrement éffectue'+ id_user +':', err);
                });
            }
        });
    }
});
module.exports = router;