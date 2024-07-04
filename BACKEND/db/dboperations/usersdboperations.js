// Ez a JS modul tartalmazza a BACKEND számára, az SQL müveleteket, amelyeket a routes mappában található auth.js és használ.

// A szükséges modulok importálása.
const pool = require('../dbconfig');


// A regisztráció.
async function registerUser(email, username, password) {
    return new Promise((resolve, reject) => {
        // Megjegyzés:  CURDATE() = jelenlegi dátum 
        // Például: INSERT INTO felhasznalok (email, felhasznalo_nev, jelszo, regisztracio_datum) VALUES ('teszt', 'teszt', SHA2('teszt', 256), CURDATE())
        pool.query('INSERT INTO felhasznalok (email, felhasznalo_nev, jelszo, regisztracio_datum) VALUES (?, ?, SHA2(?, 256), CURDATE())', [email, username, password], (error, result) => {
            if (error) {
                // Hiba esetén a hiba logolása és visszaadása.
                console.error('Hiba történt az adatbázis lekérdezés közben, registerUser függvényben.\nA hiba a következő:\n', error);
                reject(error);
            } else {
                // A results visszaadása.
                resolve(result);
            }
        });
    });
}


// Az email foglaltság ellenörzése és bejelentkezéshez email lekérdezés.
async function selectUserByEmail(email) {
    return new Promise((resolve, reject) => {
        // Például: SELECT felhasznalo_id,felhasznalo_nev FROM felhasznalok WHERE email = 'teszt@gmail.com'
        pool.query('SELECT felhasznalo_id,felhasznalo_nev,felhasznalostatusz_id FROM felhasznalok WHERE email = ?', [email], (error, result) => {
            if (error) {
                // Hiba esetén a hiba logolása és visszaadása.
                console.error('Hiba történt az adatbázis lekérdezés közben, selectUserByEmail függvényben.\nA hiba a következő:\n', error);
                reject(error);
            } else {
                // A results visszaadása.
                resolve(result);
            }
        });
    });
}


// A felhasználónév foglaltság ellenörzése.
async function selectUserByUsername(username) {
    return new Promise((resolve, reject) => {
        // Például: SELECT felhasznalo_id,felhasznalo_nev FROM felhasznalok WHERE felhasznalo_nev = 'teszt'
        pool.query('SELECT felhasznalo_id,felhasznalo_nev FROM felhasznalok WHERE felhasznalo_nev = ?', [username], (error, result) => {
            if (error) {
                // Hiba esetén a hiba logolása és visszaadása.
                console.error('Hiba történt az adatbázis lekérdezés közben, selectUserByUsername függvényben.\nA hiba a következő:\n', error);
                reject(error);
            } else {
                // A results visszaadása.
                resolve(result);
            }
        });
    });
}


// A bejelentkezés.
async function loginUser(email, password) {
    return new Promise((resolve, reject) => {
        // Például: SELECT felhasznalo_id,felhasznalo_nev,felhasznalostatusz_id,jog_id,email FROM felhasznalok WHERE email = 'teszt@gmail.com' AND jelszo=SHA2(teszt,256)
        pool.query('SELECT felhasznalo_id,felhasznalo_nev,felhasznalostatusz_id,jog_id,email FROM felhasznalok WHERE email = ? AND jelszo=SHA2(?,256)', [email, password], (error, elements) => {
            if (error) {
                // Hiba esetén a hiba logolása és visszaadása.
                console.error('Hiba történt az adatbázis lekérdezés közben, loginUser függvényben.\nA hiba a következő:\n', error);
                reject(error);
            }
            // A results visszaadása.
            resolve(elements);
        });
    });
};


// A felhasználó bejelentkezésének dátumának beállitása az adatbázisban.
async function lastLogged(email) {
    return new Promise((resolve, reject) => {
        // Megjegyzés:  CURDATE() = jelenlegi dátum 
        // Például: UPDATE felhasznalok SET utoljara_belepve = CURDATE() WHERE email = 'teszt@gmail.com' AND felhasznalo_id = 22
        pool.query('UPDATE felhasznalok SET utoljara_belepve = CURDATE() WHERE email = ?', [email], (error, elements) => {
            if (error) {
                // Hiba esetén a hiba logolása és visszaadása.
                console.error('Hiba történt az adatbázis lekérdezés közben, lastLogged függvényben.\nA hiba a következő:\n', error);
                reject(error);
            }
            // A results visszaadása.
            resolve(elements);
        });
    });
};


// A felhasználó adatainak lekérése.
async function getUserProfile(userId) {
    return new Promise((resolve, reject) => {
        // Például: SELECT email,felhasznalo_nev,utoljara_belepve,regisztracio_datum,felhasznalo_id FROM felhasznalokinfo WHERE felhasznalo_id = 'teszt@gmail.com'
        pool.query('SELECT email,felhasznalo_nev,utoljara_belepve,regisztracio_datum,felhasznalo_id FROM felhasznalokinfo WHERE felhasznalo_id=?', [userId], (error, elements) => {
            if (error) {
                // Hiba esetén a hiba logolása és visszaadása.
                console.error('Hiba történt az adatbázis lekérdezés közben, getUserProfile függvényben.\nA hiba a következő:\n', error);
                reject(error);
            }
            // A results visszaadása.
            resolve(elements);
        });
    });
};


// A felhasználó jelszavának módosítása.
async function updatePassword(newPassword,userId) {
    return new Promise((resolve, reject) => {
        // Például: UPDATE felhasznalok SET jelszo = SHA2('teszt',256) WHERE felhasznalo_id = userId
        pool.query('UPDATE felhasznalok SET jelszo=SHA2(?,256) WHERE felhasznalo_id = ?', [newPassword,userId], (error, result) => {
            if (error) {
                // Hiba esetén a hiba logolása és visszaadása.
                console.error('Hiba történt az adatbázis részleges frissítése közben, updatePassword függvényben.\nA hiba a következő:\n', error);
                reject(error);
            } else {
                // A results visszaadása.
                resolve(result);
            }
        });
    });
}


// A felhasználó felhasználónevének módosítása.
async function updateUsername(newUsername,userId) {
    return new Promise((resolve, reject) => {
        // Például: UPDATE felhasznalok SET felhasznalo_nev = 'teszt' WHERE felhasznalo_id = userId
        console.log(newUsername);
        console.log(userId);
        pool.query('UPDATE felhasznalok SET felhasznalo_nev = ? WHERE felhasznalo_id = ?', [newUsername,userId], (error, result) => {
            if (error) {
                // Hiba esetén a hiba logolása és visszaadása.
                console.error('Hiba történt az adatbázis részleges frissítése közben, updateUsername függvényben.\nA hiba a következő:\n', error);
                reject(error);
            } else {
                // A results visszaadása.
                resolve(result);
            }
        });
    });
}

module.exports = {
    registerUser,
    selectUserByEmail,
    selectUserByUsername,
    loginUser,
    lastLogged,
    getUserProfile,
    updatePassword,
    updateUsername
}