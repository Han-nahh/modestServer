const express = require('express');
const router = express.Router();
const colorAndSizeController = require('../Controller/colorSizeController');

// Color Routes
router.get('/colors', colorAndSizeController.getAllColors);
router.post('/colors', colorAndSizeController.addColor);
router.put('/colors/:id', colorAndSizeController.updateColor);
router.delete('/colors/:id', colorAndSizeController.deleteColor);

// Size Routes
router.get('/sizes', colorAndSizeController.getAllSizes);
router.post('/sizes', colorAndSizeController.addSize);
router.put('/sizes/:id', colorAndSizeController.updateSize);
router.delete('/sizes/:id', colorAndSizeController.deleteSize);

module.exports = router;
