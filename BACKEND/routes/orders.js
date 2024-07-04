// Ez a JS modul arra szolgál, hogy a különböző HTTP kéréseket kezelje, amelyek a rendelésekkel kapcsolatosak. Mindegyik kérést először JSON webtokennel ellenőriz. 

// A szükséges modulok importálása.
var express = require('express');
var router = express.Router();
var Db = require('../db/dboperations/ordersdboperations');
const authJwt = require('../middleware/authJW');


// Az összes fizetési mód megjelenítése. (GET http://localhost:8080/orders/paymentmethods)
router.get('/paymentmethods', (req,res) => {
  Db.getPaymentMethods() // SELECT * FROM fizmod
  .then((data) => {res.json(data);})
  .catch((error) => {
      console.error('Hiba történt:', error);
      res.status(500).json({ error: 'Valami hiba történt. Kérlek, próbáld újra később.' })
  })
});


// Egy adott rendelés (az aktuálisan belépett felhasználónak) részleteinek lekérésése. (GET http://localhost:8080/order/:orderId Például: http://localhost:8080/order/30)
router.post('/:orderId', [authJwt.verifyToken], async (req, res) => {
  const userId = req.userParams.userId;
  const orderId = parseInt(req.params.orderId);
  try {
    const UserorderDetails = await Db.getUserOrderById(orderId,userId); // SELECT * FROM orderinfo where order_id=?
    if (!UserorderDetails || UserorderDetails.length === 0 || userId != UserorderDetails[0].felhasznalo_id || orderId !=UserorderDetails[0].rendeles_id) {
      return res.status(404).json({ error: 'A keresett rendelés nem található!' });
    }
    else{
      res.json(UserorderDetails);
    }
  } catch (error) {
    console.error('Hiba történt:', error);
    res.status(500).json({ error: 'Valami hiba történt. Kérlek, próbáld újra később.' });
  }
});


// A felhasználóhoz tartozó összes rendelés. (GET http://localhost:8080/orders/userorders)
router.get('/userorders', [authJwt.verifyToken], async (req, res) => {
  const userId = req.userParams.userId;
  try {
    // A felhasználóhoz tartozó összes rendelés lekérése
    const userOrders = await Db.getAllUserOrders(userId);
    res.json(userOrders);
  } catch (error) {
    console.error('Hiba történt a felhasználóhoz tartozó rendelések lekérdezése közben:', error);
    res.status(500).json({ error: 'Valami hiba történt a rendelések lekérdezése közben. Kérlek, próbáld újra később.' });
  }
});

// A rendelés kifizetése 'orderId' alapján. (PATCH http://localhost:8080/orders/payorder/:orderId Például: http://localhost:8080/orders/payorder/198)
router.patch('/payorder/:orderId', [authJwt.verifyToken], async (req, res) => {
  const userId = req.userParams.userId;
  const orderId = parseInt(req.params.orderId);
  try {
    // A rendelés meglétének ellenörzése.
    const order = await Db.getUserOrderById(orderId,userId);
    if (!order.length) {
      return res.status(404).json({ error: 'A rendelés nem található.' });
    }
   
    // A rendeléshez tartozó felhasználó és a bejelentkezett felhasználó ellenőrzése.
    if (order[0].felhasznalo_id !== parseInt(userId)) {
      return res.status(404).json({ error: 'Ez a rendelés nem elérhető.' });
    }

    // A rendelés fizetési állapota és státuszának ellenőrzése. Ha a rendelés státusza 'Feldolgozás alatt' (vagyis 1) és még nem lett kifizetve (vagyis 0), akkor frissíti a fizetési állapotot és státuszt.
    if (order[0].rendeles_statusz_id == 2 && order[0].fizetve == 1) {
      return res.status(400).json({ error: 'A rendelés már ki van fizetve.' });
    }

    // Rendelés fizetési állapotának frissítése az adatbázisban.
    await Db.updateOrderPaymentStatus(1, userId, orderId); // Például: 1 = Igaz (alapból 0 - Hamis) Az SQL parancs: UPDATE rendelesek SET kifizetve = ? WHERE rendeles_id = ?
    await Db.updateOrderStatus(2, userId, orderId); //Például: 2 - Teljesítve (alapból 1 - Feldolgozás alatt) Az SQL parancs: UPDATE rendelesek SET rendeles_statusz = ? WHERE rendeles_id = ?
    res.json({ message: 'A rendelés sikeresen teljesítve lett.' });
  } 
  catch (error) 
  {
    // Hiba esetén a hibaüzenetet küldi vissza.
    console.error('Hiba történt:', error);
    res.status(500).json({ error: 'Valami hiba történt. Kérlek, próbáld újra később.' });
  }
});

// A rendelés leadása. (POST http://localhost:8080/orders)
router.post('/', async (req, res) => {
  const { payment, items, full_name, phone_number, address, userId } = req.body;
  try {
    if (!payment || Object.keys(payment).length === 0 || payment.length === 0 && !items || items.length === 0) {
      return res.status(400).json({ error: 'A kosár üres!' });
    }
    
    if (!full_name || !phone_number || !address) {
      return res.status(400).json({ error: 'Hiányos a számlázási cím!' });
    }

    // Az adatbázisba szúrás, userId hozzáadása
    Db.InsertOrder(payment, items, userId, full_name, phone_number, address);
    res.status(200).json({ message: 'A megrendelés sikeresen megtörtént!' });
  } 
  catch (error) {
    console.error('Hiba történt:', error);
    res.status(500).json({ error: 'Valami hiba történt. Kérlek, próbáld újra később.' });
  }
});



module.exports = router;