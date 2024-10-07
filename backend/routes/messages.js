import express from "express";
const router = express.Router();
const  pool = require('../db_connection');

router.get('/messages', function (request, response) {
    pool.query('SELECT text, sender, time FROM message LIMIT 100', [], (err, result) => {
        if(err) {
            console.error('Error getting messages;', err)
        } else {
            response.status(200).json(result.rows);
        }
    })
});

module.exports = router;



