'use strict';

const config = require('../config');


class Cart {
    static addToCart(product = null, qty = 1, cart) {
        this.removeFromCart(product.product_id, cart);
        if (!this.inCart(product.product_id, cart)) {
            let format = new Intl.NumberFormat(config.locale.lang, {
                style: 'currency',
                currency: config.locale.currency
            });
            let prod = {
                _id: product._id,
                id: product.product_id,
                productname: product.productname,
                price: product.price,
                qty: qty,
                img: product.img[0],
                formattedPrice: format.format(product.price),
                subtotal: format.format(qty * product.price)
            };
            cart.items.push(prod);
            this.calculateTotals(cart);
        }
    }

    static removeFromCart(id = 0, cart) {
        for (let i = 0; i < cart.items.length; i++) {
            console.log("1:" + cart.items);
            let item = cart.items[i];
            console.log("item:" + item.id);
            if (item.id === id) {
                cart.items.splice(i, 1);
                this.calculateTotals(cart);
                console.log("2:" + cart.items);
            }
        }

    }

    //(Number(item.id)

    static updateCart(ids = [], qtys = [], cart) {
        let map = [];
        let updated = false;

        ids.forEach(id => {
            qtys.forEach(qty => {
                map.push({
                    id: parseInt(id, 10),
                    qty: parseInt(qty, 10)
                });
            });
        });
        map.forEach(obj => {
            cart.items.forEach(item => {
                if (item.id === obj.id) {
                    if (obj.qty > 0 && obj.qty !== item.qty) {
                        item.qty = obj.qty;
                        updated = true;
                    }
                }
            });
        });
        if (updated) {
            this.calculateTotals(cart);
        }
    }

    static inCart(productID = 0, cart) {
        let found = false;
        cart.items.forEach(item => {
            if (item.id === productID) {
                found = true;
            }
        });
        return found;
    }

    static calculateTotals(cart) {
        cart.totals = 0.00;
        cart.items.forEach(item => {
            let price = item.price;
            let qty = item.qty;
            let amount = price * qty;

            cart.totals += amount;
        });
        this.setFormattedTotals(cart);
    }

    static emptyCart(request) {
        if (request.session) {
            request.session.cart.items = [];
            request.session.cart.totals = 0.00;
            request.session.cart.formattedTotals = '';
        }
    }

    static setFormattedTotals(cart) {
        let format = new Intl.NumberFormat(config.locale.lang, {
            style: 'currency',
            currency: config.locale.currency
        });
        let totals = cart.totals;
        cart.formattedTotals = format.format(totals);
    }

}

module.exports = Cart;