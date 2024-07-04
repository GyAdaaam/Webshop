// Ez a JS modul tartalmazza a játékokhoz kapcsolódó szolgáltatásokat.

// Az axios modul importálása.
import http from '../http-common';

// Az összes játék lekérdezéséhez szükséges szolgáltatás.
const getAll = (endpoint) => {
    return http.get(endpoint);
}

// A játékokhoz kapcsolódó szolgáltatások.
const GamesServices = {
    //Összes játék lekérése.
    getAllGames: () => getAll('/games'),
    //Összes műfaj lekérése.
    getAllGenres: () => getAll('/games/genres'),
    //Összes kategória lekérése.
    getAllCategories: () => getAll('/games/categories'),
    //Összes platform lekérése.
    getAllPlatforms: () => getAll('/games/platforms'),
    //Összes kiadó lekérése.
    getAllPublishers: () => getAll('/games/publishers'),
    //Összes fejlesztő lekérése.
    getAllDevelopers: () => getAll('/games/developers')
}

// Az exportálás.
export default GamesServices;