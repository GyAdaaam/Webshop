// Ez a JS modul tartalmazza a BACKEND számára, az SQL müveleteket, amelyeket a routes mappában található games.js és használ.

// A szükséges modulok importálása.
const pool = require('../dbconfig');


// A műfajok lekérése az adatbázisból (részletes keresőhöz).
async function getGenres() {
    return new Promise((resolve, reject) => {
        // Például: SELECT * FROM mufajok
        pool.query('SELECT * FROM mufajok', (error, elements) => {
            if (error) {
                // Hiba esetén a hiba logolása és visszaadása.
                console.error('Hiba történt az adatbázis lekérdezés közben, getGenres függvényben.\nA hiba a következő:\n', error);
                reject(error);
            }
            // A műfajok visszaadása.
            return resolve(elements);
        });
    });
};


// A platformok lekérése az adatbázisból (részletes keresőhöz).
async function getPlatforms() {
    return new Promise((resolve, reject) => {
        // Például: SELECT * FROM platformok
        pool.query('SELECT * FROM platformok', (error, elements) => {
            if (error) {
                // Hiba esetén a hiba logolása és visszaadása.
                console.error('Hiba történt az adatbázis lekérdezés közben, getPlatforms függvényben.\nA hiba a következő:\n', error);
                reject(error);
            }
            // A platformok visszaadása.
            return resolve(elements);
        });
    });
};


// A kiadók lekérése az adatbázishoz (részletes keresőhöz).
async function getPublishers() {
    return new Promise((resolve, reject) => {
        // Például: SELECT * FROM mufajok
        pool.query('SELECT * FROM kiadok', (error, elements) => {
            if (error) {
                // Hiba esetén a hiba logolása és visszaadása.
                console.error('Hiba történt az adatbázis lekérdezés közben, getPublishers függvényben.\nA hiba a következő:\n', error);
                reject(error);
            }
            // A műfajok visszaadása.
            return resolve(elements);
        });
    });
};


// A fejlesztők lekérése az adatbázishoz (részletes keresőhöz).
async function getDevelopers() {
    return new Promise((resolve, reject) => {
        // Például: SELECT * FROM fejlesztok
        pool.query('SELECT * FROM fejlesztok', (error, elements) => {
            if (error) {
                // Hiba esetén a hiba logolása és visszaadása.
                console.error('Hiba történt az adatbázis lekérdezés közben, getDevelopers függvényben.\nA hiba a következő:\n', error);
                reject(error);
            }
            // A műfajok visszaadása.
            return resolve(elements);
        });
    });
};


// A kategóriák lekérése az adatbázisból (részletes keresőhöz).
async function getCategories() {
    return new Promise((resolve, reject) => {
        // Például: SELECT * FROM kategoriak
        pool.query('SELECT * FROM kategoriak', (error, elements) => {
            if (error) {
                // Hiba esetén a hiba logolása és visszaadása.
                console.error('Hiba történt az adatbázis lekérdezés közben, getCategories függvényben.\nA hiba a következő:\n', error);
                reject(error);
            }
            // A kategóriák visszaadása.
            return resolve(elements);
        });
    });
};


// A játékok listázása, oldalszám szerint (50 játék / oldal).
async function selectGamesPerPage(pageNo) {
    return new Promise((resolve, reject) => {
        // Például: SELECT nev,ar,kep_id,jatek_id FROM jatekok jatek_id LIMIT ?, 50 [(4-1)*50] (A harmadik oldal tartalmának lekérése)
        pool.query('SELECT nev,ar,kep_id,jatek_id FROM jatekok jatek_id LIMIT ?, 50', [(pageNo-1)*50], (error, elements) => {
            if (error) {
                // Hiba esetén a hiba logolása és visszaadása.
                console.error('Hiba történt az adatbázis lekérdezés közben, selectGamesPerPage függvényben.\nA hiba a következő:\n', error);
                reject(error);
            }
            // A játékok visszaadása.
            resolve(elements);
        });
    });
};


// Az oldalszámok megszámlálása.
async function getTotalPages() {
    return new Promise((resolve, reject) => {
        // Például: SELECT * FROM osszes_oldal (Ez egy view ami a következőt tartalmazza: SELECT CEILING((COUNT(0) / 50)) AS total_pages FROM jatekok)
        pool.query('SELECT * FROM osszes_oldal', (error, elements) => {
            if (error) {
                // Hiba esetén a hiba logolása és visszaadása.
                console.error('Hiba történt az adatbázis lekérdezés közben, getTotalPages függvényben.\nA hiba a következő:\n', error);
                reject(error);
            }
            // Az oldalszámok visszaadása.
            resolve(elements);
        });
    });
};


// Globális keresés az adatbázisban. 
async function searchGames(searchTerm) {
    return new Promise((resolve, reject) => {
        // Például: SELECT DISTINCT nev,ar,kep_id FROM jatekok WHERE nev LIKE '%Counter-Strike%'
        pool.query('SELECT DISTINCT nev,ar,kep_id FROM jatekok WHERE nev LIKE ?', [`%${searchTerm}%`], (error, elements) => {
            if (error) {
                // Hiba esetén a hiba logolása és visszaadása.
                console.error('Hiba történt az adatbázis lekérdezés közben, searchGames függvényben.\nA hiba a következő:\n', error);
                reject(error);
            }
            // A játékok visszaadása.
            return resolve(elements);
        });
    });
};


// Részletes keresés az adatbázisban. 
async function selectGamesWhere(whereConditions) {
    return new Promise((resolve, reject) => {
        let whereClause = "";
        let values = [];

        // Név szerint. (Például: SELECT DISTINCT jatek_id,nev,kep_id,ar,mufaj_nev,kiado_nev,fejleszto_nev,kategoria_nev,ajanlott_eletkor,platform_nev,megjelenesi_datum,db FROM jatekokinfo WHERE nev = 'Counter' ORDER BY jatek_id)
        if (whereConditions.game_name) { // whereConditions.game_name = 'Counter'
            if(whereClause.length>0) whereClause+='and ';
            else whereClause+='where ';
            whereClause += 'nev LIKE ? ';
            values.push('%' + whereConditions.game_name + '%');
        }

        // Kategória szerint. (Például: SELECT DISTINCT jatek_id,nev,kep_id,ar,mufaj_nev,kiado_nev,fejleszto_nev,kategoria_nev,ajanlott_eletkor,platform_nev,megjelenesi_datum,db FROM jatekokinfo WHERE kategoria_nev = 'Többjátékos' ORDER BY jatek_id)
        if (whereConditions.category_name) { // whereConditions.category_name = 'Többjátékos'
            if(whereClause.length>0) whereClause+='and ';
            else whereClause+='where ';
            whereClause += 'kategoria_nev = ? ';
            values.push(whereConditions.category_name);
        }

        // Műfaj szerint.  (Például: SELECT DISTINCT jatek_id,nev,kep_id,ar,mufaj_nev,kiado_nev,fejleszto_nev,kategoria_nev,ajanlott_eletkor,platform_nev,megjelenesi_datum,db FROM jatekokinfo WHERE mufaj_nev = 'Akció' ORDER BY jatek_id)
        if (whereConditions.genre_name) { // whereConditions.genre_name = 'Akció'
            if(whereClause.length>0) whereClause+='and ';
            else whereClause+='where ';

            whereClause += 'mufaj_nev = ? ';
            values.push(whereConditions.genre_name);
        }

        // Legkisebb ár szerint. (Például: SELECT DISTINCT jatek_id,nev,kep_id,ar,mufaj_nev,kiado_nev,fejleszto_nev,kategoria_nev,ajanlott_eletkor,platform_nev,megjelenesi_datum,db FROM jatekokinfo WHERE ar >= 2 ORDER BY jatek_id)
        if (whereConditions.min_price) { // whereConditions.min_price = 2
            if(whereClause.length>0) whereClause+='and ';
            else whereClause+='where ';
            whereClause += 'ar >= ? ';
            values.push(whereConditions.min_price);
        }

        // Legnagyobb ár szerint. (Például: SELECT DISTINCT jatek_id,nev,kep_id,ar,mufaj_nev,kiado_nev,fejleszto_nev,kategoria_nev,ajanlott_eletkor,platform_nev,megjelenesi_datum,db FROM jatekokinfo WHERE ar <= 2 ORDER BY jatek_id)
        if (whereConditions.max_price) { // whereConditions.max_price = 2
            if(whereClause.length>0) whereClause+='and ';
            else whereClause+='where ';
            whereClause += 'ar <= ? ';
            values.push(whereConditions.max_price);
        }

        // Platform szerint. (Például: SELECT DISTINCT jatek_id,nev,kep_id,ar,mufaj_nev,kiado_nev,fejleszto_nev,kategoria_nev,ajanlott_eletkor,platform_nev,megjelenesi_datum,db FROM jatekokinfo WHERE platform_nev = 'Windows' ORDER BY jatek_id)
        if (whereConditions.platform_name) { // whereConditions.platform_name = 'Windows'
            if(whereClause.length>0) whereClause+='and ';
            else whereClause+='where ';

            whereClause += 'platform_nev = ? ';
            values.push(whereConditions.platform_name);
        }

        // Ajánlott életkor szerint. (Például: SELECT DISTINCT jatek_id,nev,kep_id,ar,mufaj_nev,kiado_nev,fejleszto_nev,kategoria_nev,ajanlott_eletkor,platform_nev,megjelenesi_datum,db FROM jatekokinfo WHERE ajanlott_eletkor = 16 ORDER BY jatek_id)
        if (whereConditions.recommended_age) { // whereConditions.recommended_age = 16
            if(whereClause.length>0) whereClause+='and ';
            else whereClause+='where ';

            whereClause += 'ajanlott_eletkor = ? ';
            values.push(whereConditions.recommended_age);
        }

        // Fejlesztő szerint. (Például: SELECT DISTINCT jatek_id,nev,kep_id,ar,mufaj_nev,kiado_nev,fejleszto_nev,kategoria_nev,ajanlott_eletkor,platform_nev,megjelenesi_datum,db FROM jatekokinfo WHERE fejleszto_nev="Valve" ORDER BY jatek_id)
        if (whereConditions.developer_name) { // whereConditions.developer_name = 'Valve'
            if(whereClause.length>0) whereClause+='and ';
            else whereClause+='where ';

            whereClause += 'fejleszto_nev = ? ';
            values.push(whereConditions.developer_name);
        }

        // Kiadó szerint. (Például: SELECT DISTINCT jatek_id,nev,kep_id,ar,mufaj_nev,kiado_nev,fejleszto_nev,kategoria_nev,ajanlott_eletkor,platform_nev,megjelenesi_datum,db FROM jatekokinfo WHERE kiado_nev="Valve" ORDER BY jatek_id)
        if (whereConditions.publisher_name) { // whereConditions.publisher_name = 'Valve'
            if(whereClause.length>0) whereClause+='and ';
            else whereClause+='where ';

            whereClause += 'kiado_nev = ? ';
            values.push(whereConditions.publisher_name);
        }


        // A lekérdezés. (Tartalma: játék_id,név,kep_id,ar,mufaj_nev,kiado_nev,fejleszto_nev,kategoria_nev,ajanlott_eletkor,platform_nev,megjelenesi_datum,db és a fentebb összeállított feltétel)
        const query = `SELECT DISTINCT jatek_id,nev,kep_id,ar FROM jatekokinfo ${whereClause} ORDER BY nev ASC`;
        pool.query(query, values, (error, elements)=> {
            if(error){
                // Hiba esetén a hiba logolása és visszaadása.
                console.error('Hiba történt az adatbázis lekérdezés közben, selectGamesWhere függvényben.\nA hiba a következő:\n', error);
                reject(error);
            }
            // Ha nincs találat, akkor hibaüzenet.
            if(elements.length === 0) {
                // Hiba esetén a hiba logolása és visszaadása.
                console.error('Nincs találat az adott szűrési feltételekre!');
            }
            // A játékok visszaadása.
            return resolve(elements);
        });
    });
}


// Összes játék lekérése az adatbázisból.
async function selectGames() {
    return new Promise((resolve, reject) => {
        // Például: SELECT nev,kep_id,jatek_id,ar FROM jatekok
        pool.query('SELECT nev,kep_id,jatek_id,ar FROM jatekok', (error, elements) => {
            if (error) {
                // Hiba esetén a hiba logolása és visszaadása.
                console.error('Hiba történt az adatbázis lekérdezés közben, selectGames függvényben.\nA hiba a következő:\n', error);
                reject(error);
            }
            // A játékok visszaadása.
            resolve(elements);
        });
    });
};


// Egy adott játék ID alapján, információk lekérése.
async function selectGameById(id) {
    return new Promise((resolve, reject) => {
        // Például: SELECT * FROM jatekokinfo WHERE jatek_id = 2
        pool.query('SELECT * FROM jatekokinfo WHERE jatek_id=?', [id],(error, elements) => {
            if (error) {
                // Hiba esetén a hiba logolása és visszaadása.
                console.error('Hiba történt az adatbázis lekérdezés közben, selectGameById függvényben.\nA hiba a következő:\n', error);
                reject(error);
            }
            // A játék visszaadása.
            resolve(elements);
        });
    });
};


// A modul exportok.
module.exports = {
    getGenres,
    getPublishers,
    getDevelopers,
    getPlatforms,
    getCategories,
    selectGamesPerPage,
    getTotalPages,
    searchGames,
    selectGamesWhere,
    selectGames,
    selectGameById
}