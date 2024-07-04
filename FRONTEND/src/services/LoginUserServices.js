// Ez a JS modul tartalmazza az adott felhasználó bejelentkeztetéséhez szükséges szolgáltatásokat tartalmazza.

// Az axios modul importálása.
import http from '../http-common';

//Felhasználó bejelentkeztetése az adott e-mail cím és jelszó alapján.
const loginUser = (email, password) => {
    return http.post('/auth/login', { email, password });
}

// Az exportok összegyűjtése.
const LoginUserServices = {
    loginUser
}

// Az exportálás.
export default LoginUserServices;
