const express = require('express');
const router = express.Router();
const { exportFile } = require('./users');


router.get('/', (req, res, next) => {
    res.send('server is up and running');
})
router.get('/chat', async (req, res, next) => {
    let export_info = await exportFile();
    res.download(export_info.file_path);
})

module.exports = router