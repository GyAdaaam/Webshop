// Ez a JS modul felelős a játék adatainak lekérdezéséért az azonosítója alapján.

// Az axios modul importálása.
import http from '../http-common';

// A játék adatainak lekérdezése az azonosítója alapján.
export const getGameById = (id) => http.get(`/games/${id}`);
