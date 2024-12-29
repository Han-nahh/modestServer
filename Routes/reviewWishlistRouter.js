const express = require('express');
const router = express.Router();
const reviewWishlistController = require('../Controller/reviewWishlistController');

router.post('/reviews', reviewWishlistController.createReview);
router.get('/reviews/:productId', reviewWishlistController.getAllReviews);
router.put('/reviews/:id', reviewWishlistController.updateReview);
router.delete('/reviews/:id', reviewWishlistController.deleteReview);

// ** Wishlist Routes **
router.post('/wishlist', reviewWishlistController.addToWishlist);
router.get('/wishlist/:userId', reviewWishlistController.getUserWishlist);
router.delete('/wishlist/:id', reviewWishlistController.removeFromWishlist);

module.exports = router;
