const express = require('express');

const shopController = require('../controllers/shop');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/product/:productId', shopController.getProduct);

router.get('/cart', isAuth, shopController.getCart);

router.get('/orders', isAuth, shopController.getOrders);

router.get('/order/:orderId', isAuth, shopController.getInvoice);

router.post('/cart', isAuth, shopController.postCart);

router.post('/cart-delete-item', isAuth, shopController.postDeleteCartProduct);

router.post('/create-order', isAuth, shopController.postOrder);

module.exports = router;
