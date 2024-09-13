const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const sequelize = require('./util/database');
const errorsController = require('./controllers/errors.js');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// Models
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

app.set('view engine', 'ejs');

app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorsController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
// A Product belongs to a User, meaning a product has a foreign key (userId) pointing to the User model.
// constraints: true enforces referential integrity, meaning Sequelize will ensure that the userId column references a valid User.
// onDelete: 'CASCADE' ensures that when a User is deleted, all associated Products will be deleted as well.
User.hasMany(Product);
// A User can have many Products, establishing a one-to-many relationship where the User is the parent and the Product is the child. This complements the Product.belongsTo(User) relationship.

Cart.belongsTo(User);
// A Cart belongs to a User, meaning the Cart has a foreign key (userId) pointing to the User. This complements the User.hasOne(Cart) relationship.
User.hasOne(Cart);
// A User can have one Cart. This defines a one-to-one relationship between User and Cart. The Cart table will have a foreign key userId to reference the User.

Product.belongsToMany(Cart, { through: CartItem });
// A Product can belong to many Carts, and vice versa. This is a many-to-many relationship, where the association is managed through an intermediate model (CartItem). The CartItem model will store cartId and productId as foreign keys.
Cart.belongsToMany(Product, { through: CartItem });
// A Cart can contain many Products, establishing the inverse of the previous relationship. Again, this relationship is mediated by the CartItem model.

Order.belongsTo(User);
// An Order belongs to a User, meaning the Order has a foreign key (userId) referencing the User model.
User.hasMany(Order);
// A User can have many Orders, establishing a one-to-many relationship between User and Order. This complements the Order.belongsTo(User) relationship.

Order.belongsToMany(Product, { through: OrderItem });
// An Order can contain many Products, and vice versa. This is a many-to-many relationship managed through the OrderItem model, which will store orderId and productId.
Product.belongsToMany(Order, { through: OrderItem });
// A Product can be part of many Orders, establishing the inverse of the previous relationship, mediated by the OrderItem model.


sequelize
    .sync()
    .then(result => {
        return User.findByPk(1);
    })
    .then(user => {
        if(user) {
            return user;
        }
        return User.create({ name: 'Anik', email: 'anik@example.com' });
    })
    .then(user => {
        return user
            .getCart()
            .then(cart => {
                if(cart) {
                    return cart;
                }
                return user.createCart();
            })
            .catch(err => console.log(err));
    })
    .then(cart => {
        app.listen(3000);
    })
    .catch(err => {
        if(err) console.log(err)
    });

