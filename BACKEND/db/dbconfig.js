// Az adatbázis kapcsolathoz szükséges információkat tartalmazzó modul.

// A szükséges modulok importálása.
var mysql = require('mysql');

const config = {
    connectionLimit: 10, // Aktív kapcsolatok korlátozzása.
    user: 'user', // Felhasználónév.
    password: 'user', // Jelszó.
    host: 'localhost', // A hoszt címe.
    database: 'webshop', // Az adatbázis neve.
    port: 3306, // A hoszton melyik porton található az adatbázis.
    dateStrings: true, // Az adatbázisból kapott dátumok stringként való eltárolása.
};

// Az adatbázis kapcsolat létrehozása.
let pool = mysql.createPool(config);

// Az adatbázis kapcsolat ellenörzése.
pool.getConnection((error) => {
    if (error) {
        // Hiba esetén a hiba logolása.
        console.error('Nem sikerült kapcsolatot létrehozni az adatbázissal!\nA hiba a következő:\n', error);
    } 
    else 
    {
        // Sikeres kapcsolat esetén a logolás.
        console.log('Sikeres kapcsolat az adatbázissal!');
    }
});


module.exports=pool;