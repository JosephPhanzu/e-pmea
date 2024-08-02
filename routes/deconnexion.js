const express = require("express");

const router = express.Router();

// Route de déconnexion
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Erreur lors de la déconnexion');
        }
        res.redirect('/'); // Rediriger vers la page de connexion ou une autre page appropriée
    });
});

module.exports = router;