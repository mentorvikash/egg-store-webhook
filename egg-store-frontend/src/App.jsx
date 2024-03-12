import React, { useState, useEffect } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [eggData, setEggData] = useState({
    count: 0,
    price: 0,
  });
  const [isLoding, setIsLoding] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoding(true);
      try {
        const response = await fetch("http://localhost:3001/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            callback: "http://localhost:3001/update-message",
          }),
        });
        const data = await response.json();
        console.log("Subscribed with ID:", data.id);

        const response1 = await fetch("http://localhost:3001/getDetail");
        const data1 = await response1.json();
        console.log({ data1 });
        setEggData(data1.eggStock);
        // setMessage(data1.eventMsg);
        setIsLoding(false);
      } catch (error) {
        setIsLoding(false);
        console.error("Error subscribing:", error);
      }
    };

    fetchData();
  }, []);

  if (isLoding) {
    return <h1>Loading....</h1>;
  }

  return (
    <div className="store">
      <h1 className="store__h1"> 🥚Eggs Store</h1>
      <h2 className="store__count">count: {eggData?.count}</h2>
      <h2 className="store__price">price: {eggData?.price}</h2>
      <p className="store__message">{message}</p>
    </div>
  );
}

export default App;
