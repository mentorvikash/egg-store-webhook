import React, { useState, useEffect } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
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
      } catch (error) {
        console.error("Error subscribing:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Egg Store Webhook Example</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
