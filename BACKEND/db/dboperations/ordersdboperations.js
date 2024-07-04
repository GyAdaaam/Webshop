// Ez a JS modul tartalmazza a BACKEND számára, az SQL müveleteket, amelyeket a routes mappában található orders.js használ.

// A szükséges modulok importálása.
const pool = require('../dbconfig');


// Rendelés leadása.
async function InsertOrder(payment, items, userId, full_name, phone_number, address) {
    // A megfelelő ID-val rendelkező játék árának lekérdezése az adatbázisból.
    const getGamePrice = await new Promise((resolve, reject) => {
        //Az SQL parancs.
        const orderHeaderValues = items.map(item => item.game_id).join(','); //Az items tömbből a megfelelő ID megkeresése. 
        const orderHeaderQuery = `SELECT jatek_id, ar FROM jatekok WHERE jatek_id IN (${orderHeaderValues})` //A megtalált ID-val SQL lekérdezése futattása az adatbázisba, a megfelelő ID-hoz tartozó megfelelő ár megtalálásához.
        // Például: SELECT jatek_id, ar FROM jatekok WHERE jatek_id IN (2, 3)
        pool.query(orderHeaderQuery, (error, results) => {
            if (error) {
                // Hiba esetén a hiba logolása és visszaadása.
                console.error("Hiba történt az ár lekérdezése közben, getGamePrice függvényben.\nA hiba a következő:\n", error);
                reject(error);
            } else {
                resolve(results);
            }
        });
    });

    // A megkapott játék ID-hoz (game_id) és darabszámhoz hozzárendeli a megfelelő árat (például:[{ game_id: 50, quantity: 1, price: 3.99 },{ game_id: 100, quantity: 1, price: 4.25 }]).
    const mergedItems = items.map(item => {
        const foundGamePrice = getGamePrice.find(row => row.jatek_id === item.game_id); // A beérkezett játék ID (game_id) alapján megkeresi az adatbázisban lévő ugyan azzal az értékkel rendelkező jatek_id-t.
        if (foundGamePrice) {
            return {
                ...item,
                price: foundGamePrice.ar // A megfelelő árat rendeli hozzá az adott játékhoz, a getGamePrice segítségével.
            };
        } else {
            throw new Error('Hiba történt, nem található ár a megadott játékhoz!');
        }
    });

    // A teljes összeg kiszámítása.
    let totalAmount = 0;
    if (mergedItems.length > 0) {
        // Reduce függvény segítségével teljes összeg kiszámítás, a játék árából és annak darabszámának megszorzásából.
        totalAmount = mergedItems.reduce((total, item) => total + (item.price * item.quantity), 0); //A kezdőérték minden esetben 0, majd a jatekok áráinak és azoknak darabszám szorzatainak összege adódik hozzá. Például a 2-es ID-val rendelkező játékból vesznek 3 darabot, és az 1-es ID-val rendelkező játékból vesznek 2 darabot akkor. 3x3,99+2x7,19=11,97+14,38=26,35
    } else {
        // Üres tömb esetén, hibát add vissza.
        throw new Error("Hiba történt, a 'mergedItems' nevű tömb üres!");
    }

    // A rendelések táblába a a fejléc (header) tartalmának beszúrása a teljesárral kiegészitve.
    let orderId; // A rendelés azonosítója.
    const orderInsertResult = await new Promise((resolve, reject) => {
        // A rendelések táblába 'header' tartalmának beszúrása a teljesárral kiegészítve.
        pool.query('INSERT INTO rendelesek (felhasznalo_id, fizmod_id, teljesar, rendeles_datum) VALUES (?, ?, ?,  CURDATE())',[userId, payment.payment_method_id, totalAmount],
            (error, results) => {
                if (error) {
                    // Hiba esetén a hiba logolása és visszaadása.
                    console.error("Hiba történt a fejléc (header) adatbázisba szúrása közben, orderInsertResult függvényben.\nA hiba a következő:\n", error);
                    reject(error);   
                } 
                // Ha nincs hiba, akkor az orderId értékét a results.insertId kapja meg.
                else 
                {
                    // A results.insertId ellenőrzése, majd átadása az orderId-nak.
                    if(results.insertId > 0)
                    {
                        orderId = results.insertId;
                    }

                    // Ellenkező esetben orderId nem kap értéket és nulla marad, és error-t add vissza.
                    else
                    {
                        // Hiba esetén a hiba logolása és visszaadása.
                        console.error('Hiba történt, a megrendelés ID-ja 0 vagy annál kisebb!\nA hiba a következő:\n',error)
                        reject(error);
                    }
                    // A results visszaadása.
                    resolve(results);
                }
            }
        );
    });

    // A rendelések táblába a rendelés tétel (items) tartalmának beszúrása a darabszám (db) és ar (ár) értékekkel kiegészítve.
    const insertItemsResult = await new Promise((resolve, reject) => {
        const orderItemsValues = mergedItems.map(item => `(${orderId}, ${item.game_id}, ${item.quantity}, ${item.price})`).join(', '); //A mergedItems tömbből a megfelelő értékeket kiveszi az SQL parancshoz és ezeket vesszővel elválasztja.
        const orderItemsQuery = `INSERT INTO rendeles_tetel (rendeles_id, jatek_id, db, ar) VALUES ${orderItemsValues}`; //Az SQL parancs definiálása.
        // Például: INSERT INTO rendeles_tetel (rendeles_id, jatek_id, db, ar) VALUES (2, 4, 5, 3.35)
        pool.query(orderItemsQuery, (error, results) => {
            if (error) {
                // Hiba esetén a hiba logolása és visszaadása.
                console.error("Hiba történt a rendelés tételek (items) adatbázisba szúrása közben, insertItemsResult függvényben.\nA hiba a következő:\n", error);
                reject(error);
            } else {
                resolve(results);
            }
        }
    )});

    // A számlázásicim táblába a rendelés számlázási címének mentése.
    const inserBillingAddressResult = await new Promise((resolve, reject) => {
        const billingAddressQuery = `INSERT INTO szamlazasicim (rendeles_id, teljes_nev, telefonszam, cim) VALUES (?, ?, ?, ?)`;
        // Például: INSERT INTO szamlazasicim (rendeles_id, teljes_nev, telefonszam, cim) VALUES (3, 'Tesztes Teszt', '+361234567', 'Magyarország, Pest megye, Budapest, Kossuth Lajos utca, 12');
        pool.query(billingAddressQuery, [orderId, full_name, phone_number, address], (error, results) => {
            if (error) {
                // Hiba esetén a hiba logolása és visszaadása.
                console.error("Hiba történt a számlázási cim adatbázisba szúrása közben, inserBillingAddressResult függvényben.\nA hiba a következő:\n", error);
                reject(error);
            } else {
                // A results visszaadása.
                resolve(results);
            }
        });
    });
}


// A fizetési módok lekérése (kosárhoz).
async function getPaymentMethods() {
    return new Promise((resolve, reject) => {
        // Például: SELECT * FROM fizmod
        pool.query('SELECT * FROM fizmod', (error, elements) => {
            if (error) {
                // Hiba esetén a hiba logolása és visszaadása.
                console.error('Hiba történt az adatbázis lekérdezés közben, getPaymentMethods függvényben.\nA hiba a következő:\n', error);
                reject(error);
            }
            // A results visszaadása.
            resolve(elements);
        });
    });
};


// Egy adott rendelés részleteinek lekérésése.
async function getUserOrderById(orderId, userId) {
    return new Promise((resolve, reject) => {
        // Például: SELECT * FROM rendelesekinfo WHERE rendeles_id=236 AND felhasznalo_id=22
        pool.query('SELECT * FROM rendelesekinfo where rendeles_id=? AND felhasznalo_id=?', [orderId,userId],(error, elements) => {
            if (error) {
                // Hiba esetén a hiba logolása és visszaadása.
                console.error('Hiba történt az adatbázis lekérdezés közben, getOrderById függvényben.\nA hiba a következő:\n', error);
                reject(error);
            }
            // A results visszaadása.
            resolve(elements);
        });
    });
};


// A felhasználóhoz tartozó összes rendelés.
async function getAllUserOrders(userId) {
    return new Promise((resolve, reject) => {
        // Például: SELECT * FROM rendelesekinfo WHERE felhasznalo_id = ?
        pool.query('SELECT * FROM rendelesekinfo WHERE felhasznalo_id = ?', [userId], (error, orders) => {
            if (error) {
                // Hiba esetén a hiba logolása és visszaadása.
                console.error('Hiba történt az adatbázis lekérdezés közben, getOrderById függvényben.\nA hiba a következő:\n', error);
                reject(error);
            } else {
                // A results visszaadása.
                resolve(orders);
            }
        });
    });
}


// A fizetve státuszának frissítése.
async function updateOrderPaymentStatus(isPaid, userId, orderId) {
    await new Promise((resolve, reject) => {
         // Például: UPDATE rendelesek SET fizetve = 1 WHERE felhasznalo_id=22 AND rendeles_id = 236
        pool.query('UPDATE rendelesek SET fizetve = ?, teljesites_datum=CURDATE()  WHERE felhasznalo_id=? AND rendeles_id = ?', [isPaid,userId,orderId], (error, result) => {
            if (error) {
                // Hiba esetén a hiba logolása és visszaadása.
                console.error('Hiba történt az adatbázis frissítése közben, updateOrderPaymentStatus függvényben.\nA hiba a következő:\n', error);
                reject(error);
            }
            // A results visszaadása.
            resolve(result);
        });
    });
}


// A rendelés státuszának frissítése.
async function updateOrderStatus(newStatus, userId, orderId) {
    await new Promise((resolve, reject) => {
        // Például: UPDATE rendelesek SET rendeles_statusz = 2 WHERE felhasznalo_id=22 AND rendeles_id = 236
        pool.query('UPDATE rendelesek SET rendeles_statusz = ? WHERE felhasznalo_id=? AND rendeles_id = ?', [newStatus,userId,orderId], (error, result) => {
            if (error) {
                // Hiba esetén a hiba logolása és visszaadása.
                console.error('Hiba történt az adatbázis frissítése közben, updateOrderStatus függvényben.\nA hiba a következő:\n', error);
                reject(error);
            }
            // A results visszaadása.
            resolve(result);
        });
    });
}


// Az összes modul exportálása.
module.exports = {
    InsertOrder,
    getPaymentMethods,
    getUserOrderById,
    getAllUserOrders,
    updateOrderPaymentStatus,
    updateOrderStatus
}