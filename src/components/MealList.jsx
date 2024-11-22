import axios from "axios";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "./MealList.css";

const MealList = () => {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`
        );
        const data = response.data.meals;

        const mealsWithPrices = (data || []).map((meal) => ({
          ...meal,
          price: Number((Math.random() * (50 - 10) + 10).toFixed(2)),
          quantity: 1,
        }));

        setItems(mealsWithPrices);
      } catch (err) {
        console.log("ERROR:", err);
        toast("Failed to fetch meals. Please try again later.");
      }
    };
    fetchMeals();
  }, [searchQuery]);

  const addToCart = (meal) => {
    setCart((prevCart) => {
      const existingMeal = prevCart.find((item) => item.idMeal === meal.idMeal);
      if (existingMeal) {
        return prevCart.map((item) =>
          item.idMeal === meal.idMeal
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...meal, quantity: 1 }];
    });
  };

  const increaseQuantity = (idMeal) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.idMeal === idMeal ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (idMeal) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.idMeal === idMeal
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const calculateTotalPrice = () => {
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const calculateTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = () => {
    toast("Checkout Successful!, your cart has been cleared");
    setCart([]);
  };

  return (
    <div className="view">
      <header>
        <h1>
          <i>Food Order App</i>
        </h1>
      </header>

      <input
        type="text"
        placeholder="Search meals"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search_meals"
      />

      <button
        className="toggle_button"
        onClick={() => setShowCart((prev) => !prev)}
      >
        <FontAwesomeIcon icon={faShoppingCart} />

        {` ${showCart ? "Hide Cart" : "Show Cart"} `}

        {cart.length > 0 && (
          <span className="cart-count">{calculateTotalItems()}</span>
        )}
      </button>

      <div className="order_meals">
        <div className="meal_list">
          {items.length > 0 ? (
            items.map(({ strMeal, strMealThumb, idMeal, price }) => (
              <div key={idMeal} className="itemlist_container">
                <img className="img_boxes" src={strMealThumb} alt={strMeal} />
                <div className="name_price">
                  <div>
                    <b>{strMeal}</b>
                  </div>
                  <div>
                    <p>${price}</p>
                  </div>

                  <div>
                    <button
                      onClick={() => addToCart({ strMeal, idMeal, price })}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>
              {searchQuery ? (
                <p>No meals found! Try another search.</p>
              ) : (
                <p>Loading meals...</p>
              )}
            </div>
          )}
        </div>

        {showCart && (
          <div className="cart">
            <h2>Your Cart</h2>
            {cart.length > 0 ? (
              <>
                <ul>
                  {cart.map(({ idMeal, strMeal, price, quantity }) => (
                    <li key={idMeal} className="cart_item">
                      <span>{strMeal}</span>
                      <span>${(price * quantity).toFixed(2)}</span>
                      <span>
                        <button onClick={() => decreaseQuantity(idMeal)}>
                          -
                        </button>
                        <span>{quantity}</span>
                        <button onClick={() => increaseQuantity(idMeal)}>
                          +
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
                <h3>Total: ${calculateTotalPrice()}</h3>
                <button className="checkout_button" onClick={handleCheckout}>
                  Checkout
                </button>
              </>
            ) : (
              <p>Your cart is empty!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MealList;
