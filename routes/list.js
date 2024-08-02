const express = require("express");

const router = express.Router();

router.get('/rece', async (req, res) => {

    const { fonction, id_user } = req.query;  // Utilisation de req.query pour récupérer les paramètres de la requête GET

    const getPaginatedData = (page, limit) => {
        const offset = (page - 1) * limit;
        let query = '';
        let params = [];

        if (fonction === 'admin') {
            query = `SELECT * FROM recensement LIMIT ? OFFSET ?`;
            params = [limit, offset];
        } else if(fonction === 'agent') {
            query = `SELECT * FROM recensement WHERE id_user = ? LIMIT ? OFFSET ?`;
            params = [id_user, limit, offset];
        }

        return new Promise((resolve, reject) => {
            req.optionBdd.query(query, params, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    };

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    try {
        const data = await getPaginatedData(page, limit);
        res.json({ data: data, page: page, limit: limit });
    } catch (err) {
        res.status(500).send('Error fetching data');
    }
});

router.get('/patente', async (req, res) => {

    const { fonction, id_user, typePat } = req.query;  // Utilisation de req.query pour récupérer les paramètres de la requête GET

    const getPaginatedData = (page, limit) => {
        const offset = (page - 1) * limit;
        let query = '';
        let params = [];

        if (fonction === 'admin') {
            query = `SELECT * FROM patentecom WHERE typePat = ? LIMIT ? OFFSET ?`;
            params = [typePat, limit, offset];
        } else if(fonction === 'agent') {
            query = `SELECT * FROM patentecom WHERE typePat = ? id_user = ? LIMIT ? OFFSET ?`;
            params = [typePat, id_user, limit, offset];
        }

        return new Promise((resolve, reject) => {
            req.optionBdd.query(query, params, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    };

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    try {
        const data = await getPaginatedData(page, limit);
        res.json({ data: data, page: page, limit: limit });
    } catch (err) {
        res.status(500).send('Error fetching data');
    }
});

module.exports = router;