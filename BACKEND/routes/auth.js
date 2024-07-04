// Ez a JS modul arra szolgál, hogy a különböző HTTP kéréseket kezelje, amelyek a felhasználóval kapcsolatosak.

// A szükséges modulok importálása.
var express = require('express');
var router = express.Router();
var Db = require('../db/dboperations/usersdboperations');
var jwt = require('jsonwebtoken');
const config = require('../db/authconfig');
const authJwt = require('../middleware/authJW');


// A bejelentkezés. (POST http://localhost:8080/auth/login)
router.post('/login', function(req,res)
{
    Db.loginUser(req.body.email,req.body.password) // SELECT felhasznalo_nev FROM felhasznalok WHERE email = ?
    .then(data=>data[0])
    .then(data=>{
        if (!data) {
            // A felhasználó nem található az adatbázisban.
            res.status(404).json({ error: "Az e-mail cím vagy jelszó helytelen." });
            return;
        }

        // A felhasználói státusz ellenőrzése. Ha státusz 2 akkor a fiók törölve lett, nem elérhető.
        if (data.felhasznalostatusz_id == 2) {
            res.status(403).json({ error: "A felhasználó törölve lett." });
            return;
        }

        // A felhasználó adatainak összeállítása a JWT tokenhez.
        const packet={"email":data.email, "role":data.jog_id, "userId": data.felhasznalo_id};
        // JWT token generálása a felhasználó adataival és a titkos kulccsal.
        const token=jwt.sign(packet, config.secret,{expiresIn:'1800s'}); // Érvényessége 30 perc.
        Db.lastLogged(req.body.email); // UPDATE felhasznalok SET utoljara_belepve = CURDATE() WHERE email = ? AND felhasznalo_id = ?
        res.status(200).json(
            {data:data,
            token:token
        })
    })
    .catch (error=>{
        // Hiba esetén a hiba logolása és a válasz elküldése.
        console.error("Hiba történt:", error);
        res.status(500).json({ error: "Valami hiba történt. Kérlek, próbáld újra később." })
    });
});
 

// A felhasználói adatok lekérése a felhasználói profil oldalra.  (GET http://localhost:8080/auth/userprofile)
router.get('/userprofile', [authJwt.verifyToken],
(req,res) => {
    userId = req.userParams.userId; // A felhasználó azonosítójának a lekérése a tokenből.
    Db.getUserProfile(userId) // SELECT email,felhasznalo_nev,teljesnev,utoljara_belepve,regisztracio_datum,felhasznalo_id,cim FROM felhasznalokinfo where email=?
    .then(data=> res.json(data))
    .catch(error => {
        // Hiba esetén a hiba logolása és a válasz elküldése.
        console.error("Hiba történt:", error);
        res.status(500).json({ error: "Valami hiba történt. Kérlek, próbáld újra később." })
    });
});


// A regisztráció. (POST http://localhost:8080/auth/register)
router.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body; // A felhasználói adatok lekérése a kérésből.
        // Email foglaltság ellenőrzése.
        const existingUseremail = await Db.selectUserByEmail(email); //SELECT email FROM felhasznalok WHERE email = ?
        if (existingUseremail.length > 0) {
            // Ha az email foglalt, hibaüzenet küldése.
            return res.status(400).json({ error: "Ez az e-mail cím már regisztrálva van." });
        }

        // Felhasználónév foglaltság ellenőrzése.
        const existingUserusername = await Db.selectUserByUsername(username); //SELECT email FROM felhasznalok WHERE email = ?
        if (existingUserusername.length > 0) {
            // Ha a felhasználónév foglalt, hibaüzenet küldése.
            return res.status(400).json({ error: "Ez a felhasználónév már regisztrálva van." });
        }
        // Ha az email nem foglalt, megtörténik a regisztráció.
        await Db.registerUser(email, username, password); // INSERT INTO felhasznalok (email,felhasznalo_nev,jelszo) VALUES (?,?,SHA2(?,256))
        // A válasz elküldése.
        res.status(201).json({ message: "Sikeres regisztráció!" });
    } catch (error) {
        // Hiba esetén a hiba logolása és a válasz elküldése.
        console.error("Hiba történt:", error);
        res.status(500).json({ error: "Valami hiba történt. Kérlek, próbáld újra később." });
    }
});


// A jelszó változtatás. (PATCH http://localhost:8080/auth/changepassword)
router.patch('/changepassword', [authJwt.verifyToken], async (req, res) => {
    const userId = req.userParams.userId; // A felhasználó azonosítójának a lekérése a tokenből.
    const newPassword = req.body.newPassword; // Az új jelszó lekérése a kérésből.
    try {
        await Db.updatePassword(newPassword,userId); // UPDATE felhasznalok SET jelszo=SHA2(?,256) WHERE felhasznalo_id = ?
        res.status(200).json({ message: 'A jelszó sikeresen frissítve.' }); // A válasz elküldése.
    } catch (error) {
        // Hiba esetén a hiba logolása és a válasz elküldése.
        console.error('Hiba történt:', error);
        res.status(500).json({ error: 'Valami hiba történt. Kérlek, próbáld újra később.' });
    }
});


// A felhasználónév változtatás (PATCH http://localhost:8080/auth/changeusername)
router.patch('/changeusername', [authJwt.verifyToken], async (req, res) => {
    const userId = req.userParams.userId; // A felhasználó azonosítójának a lekérése a tokenből.
    const newUsername = req.body.newUsername; // Az új felhasználónév lekérése a kérésből.
    try {
        await Db.updateUsername(newUsername,userId); // UPDATE felhasznalok SET felhasznalo_nev = ? WHERE felhasznalo_id = ?
        res.status(200).json({ message: 'A felhasználónév sikeresen frissítve.' }); // A válasz elküldése.
    } catch (error) {
        // Hiba esetén a hiba logolása és a válasz elküldése.
        console.error('Hiba történt:', error);
        res.status(500).json({ error: 'Valami hiba történt. Kérlek, próbáld újra később.' });
    }
});


module.exports=router;