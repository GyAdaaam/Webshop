// Ez a JS modul arra szolgál, hogy a különböző HTTP kérésekben a JSON Web Token (JWT) ellenőrizze.

// A szükséges modulok importálása.
const jwt=require("jsonwebtoken");
const config=require('../db/authconfig');


// A token ellenörzése.
verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
    // Ha nincs token.
    if (!token) {
        // A válasz elküldése.
        return res.status(401).send({ message: "Nincs token megadva!" });
    }
    // Ha van token. 
    else {
        // A token ellenörzése.
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                // Hiba esetén a hiba logolása és a válasz elküldése.
                console.error("Token ellenőrzése sikertelen:", err);
                return res.status(401).send({ message: "Érvénytelen token." });
            }
            req.userParams = decoded; // A token-ben található adatokat a req.userParams-ba mentése.
            console.log('Kiadva: ' + new Date(1000 * req.userParams.iat).toLocaleString()); // A token kiadásának idejének logolása.
            console.log('Érvényes: ' + new Date(1000 * req.userParams.exp).toLocaleString()); // A token érvényességének logolása.
            req.userParams["expDate"] = new Date(1000 * req.userParams.exp).toLocaleString(); // A token érvényességének a req.userParams-ba mentése.
            next(); // A következő middleware hívása.
        });
    }
}


const authJwt={
    verifyToken : verifyToken,
}


module.exports=authJwt;