// Ez a JS modul a fő komponens, amely a többi komponenst fogja tartalmazni.

//A szükséges komponensek importálása.
import './App.css'; // Az App komponenshez tartozó CSS fájl importálása.
import MyNavbar from './components/MyNavbar/MyNavbar'; // Az App komponenshez tartozó Navbar komponens importálása.
import Footer from './components/Footer/Footer'; // Az App komponenshez tartozó Footer komponens importálása.
import Gamelist from './components/GameList/GameList'; // Az App komponenshez tartozó GameList komponens importálása.
import Home from './components/Home/Home'; // Az App komponenshez tartozó Home komponens importálása.
import Cart from './components/Cart/Cart'; // Az App komponenshez tartozó Cart komponens importálása.
import UserRegister from './components/UserRegister/UserRegister'; // Az App komponenshez tartozó UserRegister komponens importálása.
import UserLogin from './components/UserLogin/UserLogin'; // Az App komponenshez tartozó UserLogin komponens importálása.
import Contact from './components/Contact/Contact'; // Az App komponenshez tartozó Contact komponens importálása.
import AboutUs from './components/AboutUs/AboutUs'; // Az App komponenshez tartozó AboutUs komponens importálása.
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; // A React Router modulok importálása.
import SearchResultsComponent from './components/Search/SearchResultsComponent'; // Az App komponenshez tartozó SearchResultsComponent komponens importálása.
import UserProfile from './components/UserProfile/UserProfile'; // Az App komponenshez tartozó UserProfile komponens importálása.
import { useState, useEffect } from 'react'; // A useState, useEffect hookok importálása.

// App komponens.
function App() {
  // Az islogged állapot.
  const [islogged, setIslogged] = useState(false);
  const [userId, setUserId] = useState('');


  // Az islogged állapot beállítása a sessionStorage-ből.
  useEffect(() => {
    // Az islogged állapot beállítása a sessionStorage-ből.
    const loggedIn = sessionStorage.getItem('islogged');
    if (loggedIn) {
      setIslogged(true);
    }
  }, [islogged]);

  // A kosár állapotának beállítása.
  const [cart, set_cart] = useState([]);

  // A kosár állapotának frissítése.
  const updateCart = (newCart) => {
    set_cart(newCart);
    sessionStorage.setItem('cart', JSON.stringify(newCart));
  };
  
  // A kosárba tétel függvénye.
  const add_To_cart = (games) => {
    // A kosár állapotának lekérése a sessionStorage-ből.
    const storedCart = JSON.parse(sessionStorage.getItem('cart'));
    // Ha a kosár nem üres, akkor a kosár frissítése.
    if (storedCart && storedCart.length > 0) {
      // Ha a kosárban már van ilyen termék, akkor a termék mennyiségének növelése.
      const have = storedCart.find(item => item.products.jatek_id === games.jatek_id);
      if (have) {
        // A kosár frissítése.
        const newCart = storedCart.map(item =>
          item.products.jatek_id === games.jatek_id ? { ...item, quantity: item.quantity + 1 } : item
        );
        // A kosár állapotának beállítása.
        sessionStorage.setItem('cart', JSON.stringify(newCart));
        // A kosár állapotának beállítása.
      } else {
        // A kosár frissítése.
        const newCart = [...storedCart, { products: games, quantity: 1 }];
        // A kosár állapotának beállítása.
        sessionStorage.setItem('cart', JSON.stringify(newCart));
      }
      // Ha a kosár üres, akkor a kosár beállítása.
    } else {
      // A kosár beállítása.
      const newCart = [{ products: games, quantity: 1 }];
      // A kosár állapotának beállítása.
      sessionStorage.setItem('cart', JSON.stringify(newCart));
    }
  };

// A kosárból való törlés függvénye.
useEffect(() => {
  const storedCart = JSON.parse(sessionStorage.getItem('cart')); // A kosár állapotának lekérése a sessionStorage-ből.
  // Ha a kosár állapota nem üres, akkor a kosár állapotának beállítása.
  if (storedCart) {
    // A kosár állapotának beállítása.
    set_cart(storedCart);
  }
}, []);


const removeFromCart = (productId) => {
  const updatedCart = cart.filter(item => item.products.jatek_id !== productId);
  updateCart(updatedCart);
};


  // Az App komponens visszatérési értéke.
  return (
    <BrowserRouter>
    <div className='App'>
    <MyNavbar isLogged={islogged} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aruhaz" element={<Gamelist add_To_cart={add_To_cart} />} />
        {islogged ? ( 
          <Route path="/profil" element={<UserProfile islogged={islogged} setIslogged={setIslogged} />} /> 
        ) : (
          <Route path="/bejelentkezes" element={<UserLogin setIslogged={setIslogged} />} /> 
        )}
        <Route path="/bejelentkezes" element={<UserLogin setIslogged={setIslogged} />} /> 
        <Route path="/profil" element={<UserProfile islogged={islogged} setIslogged={setIslogged} setUserId={setUserId} />} /> 
        <Route path="/regisztracio" element={<UserRegister />} />  
        <Route path="/rolunk" element={<AboutUs />} /> 
        <Route path="/kosar" element={<Cart userId={userId} removeFromCart={removeFromCart}/>} /> 
        <Route path="/kapcsolat" element={<Contact />} /> 
        <Route path="/kereses" element={<SearchResultsComponent />} /> 
        {islogged ? (
          <Route path="/bejelentkezes" element={<Navigate to="/profil" />} />
        ) : null}
      </Routes>
      <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
