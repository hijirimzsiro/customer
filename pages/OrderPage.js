import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { apiBaseUrl } from "../settings.js";

const API_URL = apiBaseUrl;

function OrderPage() {
  const [menuItems, setMenuItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/public_menus`)
      .then((res) => res.json())
      .then((data) => {
        setMenuItems(data.menus || []);
      })
      .catch((error) => console.error("❌ 無法取得菜單：", error));
  }, []);

  const handleAddToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((i) => i.menu_id === item.menu_id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        menu_id: item.menu_id,
        name: item.name,
        price: item.price,
        quantity: 1,
        imgUrl: item.imgUrl
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`✅ ${item.name} 已加入購物車`);
  };

  return (
    <div className="order-page-container">
      <h1 className="order-title">請選擇您想要的品項</h1>
      <div className="menu-container">
        {menuItems.map((item) => (
          <div className="menu-card" key={item.menu_id}>
            <img
              src={item.imgUrl}
              alt={item.name}
              className="menu-image"
            />
            <div className="menu-info">
              <h3>{item.name}</h3>
              <p>價格：{item.price} 元</p>
              <button onClick={() => handleAddToCart(item)}>加入購物車</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderPage;
