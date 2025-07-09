import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [item, setItem] = useState(null);
  const [banList, setBanList] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchItem() {
    setLoading(true);
    try {
      const res = await fetch("https://api.thecatapi.com/v1/images/search?has_breeds=1", {
        headers: {
          "x-api-key": "live_hxVAagRRjqMA4bg8zUuahfJeHovF0EzkZIQqwFGtyFETSKshWB0gvwSOtgUMEwaM"
        }
      });
      const data = await res.json();
      const cat = data[0];

      if (!cat || !cat.breeds || !cat.breeds[0]) {
        console.log("Missing breed, skipping...");
        fetchItem();
        return;
      }

      const breed = cat.breeds[0];
      const valuesToCheck = [
        breed.name,
        breed.origin,
        breed.weight.imperial + " lbs",
        breed.life_span + " years"
      ];

      if (valuesToCheck.some(val => banList.includes(val))) {
        console.log("Blocked by ban list, skipping...");
        fetchItem();
        return;
      }

      setItem(cat);
    } catch (err) {
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleBan(val) {
    if (!banList.includes(val)) {
      setBanList([...banList, val]);
    }
  }

  function handleUnban(val) {
    setBanList(banList.filter(b => b !== val));
  }

  return (
    <div className="app">
      <h1>🐱 Veni Vici: Discover Cats</h1>
      <button onClick={fetchItem}>Discover New Cat</button>

      {loading && <p>Loading...</p>}

      {item && !loading && (
        <div className="card">
          <h2>{item.breeds[0].name}</h2>
          <div className="tags">
            <span onClick={() => handleBan(item.breeds[0].name)}>{item.breeds[0].name}</span>
            <span onClick={() => handleBan(item.breeds[0].origin)}>{item.breeds[0].origin}</span>
            <span onClick={() => handleBan(item.breeds[0].weight.imperial + " lbs")}>
              {item.breeds[0].weight.imperial} lbs
            </span>
            <span onClick={() => handleBan(item.breeds[0].life_span + " years")}>
              {item.breeds[0].life_span} years
            </span>
          </div>
          <img src={item.url} alt="cat" width={300} />
        </div>
      )}

      <h2>🚫 Ban List:</h2>
      <ul>
        {banList.map((val, idx) => (
          <li key={idx} onClick={() => handleUnban(val)}>
            {val}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
