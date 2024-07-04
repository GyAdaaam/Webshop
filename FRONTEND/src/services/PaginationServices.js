// Ez a JS modul az oldalszámok lekérdezésére szolgáló service-ket tartalmazza.

//Az axios modul importálása.
import http from '../http-common';

//Az összes oldalszám lekérése.
const getTotalPages = () => {
    return http.get('/games/totalpage');
}

//Jelenlegi oldalszám lekérése.
const getPage = (pageNo) => {
    return http.get(`/games/page/${pageNo}`);
}

//Az exportok összegyűjtése.
const PaginationServices = {
    getTotalPages,
    getPage
}

//Az exportálás.
export default PaginationServices;