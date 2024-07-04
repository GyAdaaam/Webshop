// Ez a JS modul arra szolgál, hogy a különböző HTTP kéréseket kezelje, amelyek a játékokkal másnéven a termékkel kapcsolatosak.

// A szükséges modulok importálása.
var express = require('express');
var router = express.Router();
var Db = require('../db/dboperations/gamesdboperations');


// Az összes műfaj megjelenítése. (GET http://localhost:8080/games/genres)
router.get('/genres', (req,res) => {
  Db.getGenres() // SELECT * FROM mufajok
  .then((data) => {res.json(data);})
  .catch((error) => {
    console.error('Hiba történt:', error);
    res.status(500).json({ error: 'Valami hiba történt. Kérlek, próbáld újra később.' })
  })
});


// Az összes platform megjelenítése. (GET http://localhost:8080/games/platforms)
router.get('/platforms', (req,res) => {
    Db.getPlatforms() // SELECT * FROM platformok
    .then((data) => {res.json(data);})
    .catch((error) => {
        console.error('Hiba történt:', error);
        res.status(500).json({ error: 'Valami hiba történt. Kérlek, próbáld újra később.' })
    })
});


// Az összes kategória megjelenítése. (GET http://localhost:8080/games/categories)
router.get('/categories', (req,res) => {
    Db.getCategories() // SELECT * FROM kategoriak
    .then((data) => {res.json(data);})
    .catch((error) => {
        console.error('Hiba történt:', error);
        res.status(500).json({ error: 'Valami hiba történt. Kérlek, próbáld újra később.' })
    })
});

// Az összes kiadó megjelenítése. (GET http://localhost:8080/games/publishers)
router.get('/publishers', (req,res) => {
  Db.getPublishers() // SELECT * FROM kiadok
  .then((data) => {res.json(data);})
  .catch((error) => {
      console.error('Hiba történt:', error);
      res.status(500).json({ error: 'Valami hiba történt. Kérlek, próbáld újra később.' })
  })
});

// Az összes fejlesztő megjelenítése. (GET http://localhost:8080/games/developers)
router.get('/developers', (req,res) => {
  Db.getDevelopers() // SELECT * FROM fejlesztok
  .then((data) => {res.json(data);})
  .catch((error) => {
      console.error('Hiba történt:', error);
      res.status(500).json({ error: 'Valami hiba történt. Kérlek, próbáld újra később.' })
  })
});

// A játékok listázása oldalszám szerint, egy oldalon 50 játék/adat. (GET http://localhost:8080/games/page/oldalszam Például: http://localhost:8080/games/page/20)
router.get('/page/:pageNo', (req, res) => {
  let page = Number(req.params.pageNo);
  Db.selectGamesPerPage(page) // SELECT nev,ar,kep_id,jatek_id FROM jatekok jatek_id LIMIT ?, 50
      .then(data => res.json(data))
      .catch((error) => {
        console.error('Hiba történt:', error);
        res.status(500).json({ error: 'Valami hiba történt. Kérlek, próbáld újra később.' })
      })
});


// Az összes oldalszám. (GET http://localhost:8080/games/totalpages)
router.get('/totalpages', (req,res) => {
    Db.getTotalPages() // SELECT * FROM osszes_oldal
    .then(data => res.json(data))
    .catch((error) => {
        console.error('Hiba történt:', error);
        res.status(500).json({ error: 'Valami hiba történt. Kérlek, próbáld újra később.' })
    })
});


// A Globális kereső. (GET http://localhost:8080/games/search/:keyword Például: http://localhost:8080/games/search/Counter-Strike)
router.get('/search/:keyword', (req, res) => {
    const searchGame = '%' + req.params.keyword + '%';
    if (!searchGame) {
      return res.status(400).json({ error: 'Nem megfelelő vagy hiányzó keresési kifejezés.' });
    }
    Db.searchGames(searchGame) // SELECT DISTINCT nev,ar,kep_id FROM jatekok WHERE nev LIKE ?
      .then(result => res.json(result))
      .catch((error) => {
        console.error('Hiba történt:', error);
        res.status(500).json({ error: 'Valami hiba történt. Kérlek, próbáld újra később.' })
      })
});


// A részletes keresés. (POST http://localhost:8080/games/filter)
router.post('/filter', (req, res) => {
    let js = req.body;
    //Bekért adatok ellenörzése.
    if (!js || Object.keys(js).length === 0) {
      return res.status(400).json({ error: 'Érvénytelen szűrési feltételek!' });
    }
    Db.selectGamesWhere(js) // SELECT DISTINCT jatek_id,nev,kep_id,ar,mufaj_nev,kiado_nev,fejleszto_nev,kategoria_nev,ajanlott_eletkor,platform_nev,megjelenesi_datum,db FROM jatekokinfo ${whereClause} ORDER BY jatek_id
    .then(data => {
      if (data.length === 0) {
          return res.status(404).json({ error: 'Nincs találat az adott szűrési feltételre(kre)!' });
      }
      res.json(data);
  })
});


// Összes játék/adat megjelenítése. (GET http://localhost:8080/games)
router.get('/', (req,res) => {
  Db.selectGames() // SELECT nev,kep_id,jatek_id,ar FROM jatekok
  .then((data) => {res.json(data);})
  .catch((error) => {
      console.error('Hiba történt:', error);
      res.status(500).json({ error: 'Valami hiba történt. Kérlek, próbáld újra később.' })
  })
});


// Egy adott játék ('jatek_id' alapján), megjelenitése összes adattal. (GET http://localhost:8080/games/:id Például: http://localhost:8080/games/1000)
router.get('/:id', (req, res) => {
  const id = req.params.id;
  Db.selectGameById(id) // SELECT * FROM jatekokinfo WHERE jatek_id=?
    .then((data) => {
      if (!data.length) {
        return res.status(404).json({ error: 'Nem található a keresett játék!' });
      }
      res.json(data);
    })
    .catch((error) => {
      console.error('Hiba történt:', error);
      res.status(500).json({ error: 'Valami hiba történt. Kérlek, próbáld újra később.' });
    });
});


module.exports = router;