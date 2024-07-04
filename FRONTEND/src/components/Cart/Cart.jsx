// Ez a JSX modul tartalmazza a kosár oldal megjelenítéséhez szükséges kódot.

// A szükséges importok.
import React, { useState, useEffect } from "react"; // A React modulok importálása.
import OrderServices from '../../services/OrderServices'; // Az OrderServices modul importálása.
import './Cart.css'; // A Cart.css stílus importálása.

export default function Cart({ userId }) { // A Cart komponens.
  const [data, setData] = useState([]); // A data állapot és a setData függvény inicializálása.
  const [totalPrice, setTotalPrice] = useState(0); // A totalPrice állapot és a setTotalPrice függvény inicializálása.
  const [paymentMethods, setPaymentMethods] = useState([]); // A paymentMethods állapot és a setPaymentMethods függvény inicializálása.
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(""); // A selectedPaymentMethod állapot és a setSelectedPaymentMethod függvény inicializálása.
  const [fullName, setFullName] = useState(""); // A fullName állapot és a setFullName függvény inicializálása.
  const [phoneNumber, setPhoneNumber] = useState(""); // A phoneNumber állapot és a setPhoneNumber függvény inicializálása.
  const [address, setAddress] = useState(""); // A address állapot és a setAddress függvény inicializálása.

  // Az useEffect hook.
  useEffect(() => {
    const storedData = JSON.parse(sessionStorage.getItem('cart'));
    if (storedData) {
      setData(storedData);
    }
  }, []);

  // Az teljes ár useEffect hook.
  useEffect(() => {
    let total = 0;
    data.forEach(item => {
      total += item.products.ar * item.quantity;
    });
    setTotalPrice(total.toFixed(2));
  }, [data]);

  // Az fizetési mód lekérés useEffect hook.
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await OrderServices.getPaymentMethods();
        setPaymentMethods(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPaymentMethods();
  }, []);

  // A törlés függvény.
  const handleDelete = (index) => {
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
    sessionStorage.setItem('cart', JSON.stringify(newData));
  };

  // A mennyiség növelése függvény.
  const handleIncreaseQuantity = (index) => {
    const newData = [...data];
    newData[index].quantity += 1;
    setData(newData);
    sessionStorage.setItem('cart', JSON.stringify(newData));
  };

  // A mennyiség csökkentése függvény.
  const handleDecreaseQuantity = (index) => {
    const newData = [...data];
    if (newData[index].quantity > 1) {
      newData[index].quantity -= 1;
      setData(newData);
      sessionStorage.setItem('cart', JSON.stringify(newData));
    }
  };

  // A rendelés függvény.
  const handleOrder = async () => {
    if (!userId) {
      alert("Vásárlás előtt kérlek jelentkezz be!");
      return;
    }

    // Az orderData objektum.
    const orderData = {
      "payment": {
        "payment_method_id": selectedPaymentMethod
      },
      "items": data.map((item) => ({
        "game_id": item.products.jatek_id,
        "quantity": item.quantity
      })),
      "full_name": fullName,
      "phone_number": phoneNumber,
      "address": address,
      "userId": userId
    };

    try {
      const response = await OrderServices.order(orderData);
      alert("Sikeres vásárlás!");
      setData([]);
      sessionStorage.removeItem('cart');
    } catch (error) {
      console.log(error);
    }
  };

  // A visszatérési érték.
  return (
    <div className="cart-container">
      <div className="row">
        <div className="col-lg-8">
          <div className="row">
            {data.map((item, index) => (
              <div key={index} className="col-lg-6 mb-3">
                <div className="card h-100 cart-cards">
                  <div className="card-img-container">
                    <img src={`http://localhost:8080/images/header/${item.products.jatek_id}.jpg`} className="card-img-top" alt={item.products.nev} />
                  </div>
                  <div className="cart-card-header">
                    <h5 className="cart-card-title">{item.products.nev}</h5>
                    <p className="cart-card-price">Ár: {item.products.ar}€</p>
                  </div>
                  <div className="card-body">
                    <div className="quantity-container mb-2">
                      <button className="btn btn-sm btn-secondary me-2 cart-decrease" onClick={() => handleDecreaseQuantity(index)}>-</button>
                      <span className="cart-quantity">Mennyiség: {item.quantity}</span>
                      <button className="btn btn-sm btn-secondary ms-2 cart-increase" onClick={() => handleIncreaseQuantity(index)}>+</button>
                    </div>
                    <p className="card-totalprice">Összesen: {(item.products.ar * item.quantity).toFixed(2)}€</p>
                    <button className="btn btn-danger cart-deletebutton" onClick={() => handleDelete(index)}>Törlés</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card order-summary">
            <div className="order-summary">
              <h5 className="order-summary-title">Rendelési adatok</h5>
              <select className="form-select mb-2" value={selectedPaymentMethod} onChange={(e) => setSelectedPaymentMethod(e.target.value)}>
                <option value="">Válassz fizetési módot</option>
                {paymentMethods.map((method) => (
                  <option key={method.fizmod_id} value={method.fizmod_id}>{method.fizmod}</option>
                ))}
              </select>
              <input type="text" className="form-control mb-2" placeholder="Teljes név például: Kis Pista" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              <input type="number" className="form-control mb-2" placeholder="Telefonszám például: 062012234" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              <input type="text" className="form-control mb-2" placeholder="Cím például: 1007 Budapest Andrássy út 12" value={address} onChange={(e) => setAddress(e.target.value)} />
              <div className="text-center">
                <p className="total-price">Teljes összeg: {totalPrice}€</p>
                <button className="btn btn-primary order-button" onClick={() => handleOrder()}>Véglegesítés</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
