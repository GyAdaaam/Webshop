// Ez a JS modul felelős a rendelések lekérdezéséért az azonosítója alapján.

// Az axios modul importálása.
import http from '../http-common';

// Az összes fizetési mód lekérés az adatbázisból.
const getPaymentMethods = () => {
    return http.get('/orders/paymentmethods');
}

// A rendelés adatainak lekérdezése az azonosítója alapján.
const getOrderById = (orderId) => {
    return http.post(`/orders/${orderId}`);
}

// A felhasználó rendeléseinek lekérdezése.
const getUserOrders = () => {
    return http.get('/orders/userorders');
}

// Rendelés fizetése.
const payOrder = (orderId) => {
    return http.patch(`/orders/payorder/${orderId}`);
}

const order = (data) =>{
    return http.post(`/orders/`,data)
}

// Az exportok összegyűjtése.
const OrderServices = {
    getPaymentMethods,
    getOrderById,
    getUserOrders,
    payOrder,
    order
}

// Az exportálás.
export default OrderServices;
