const express = require('express');
const router = express.Router();
const pool = require('../db_connection');

router.get('/messages', function (request, response) {
    pool.query(`
        SELECT m.text AS message , u.username AS sender, TO_CHAR(m.time, 'HH24:MI') AS time
        FROM message m
        JOIN "user" u ON m.sender = u.user_id
        LIMIT 100;
    `, [], (err, result) => {
        if (err) {
            console.error('Error getting messages;', err);
            return response.status(500).json({ error: 'Failed to retrieve messages' });
        } else {
            response.status(200).json(result.rows);
        }
    });
});


module.exports = router;



