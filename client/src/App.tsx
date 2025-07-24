import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import List from "./components/List";

function App() {
  const [logo, setLogo] = useState<string>("");
  const [properties, setProperties] = useState<any[]>([]);

  const getProperties = async () => {
    try {
      const response = await fetch("http://localhost:3000/properties"); // Access-Control-Allow-Origin problem with CORS
      const data = await response.json();
      setProperties(data);
      console.log("Properties fetched successfully:", data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  useEffect(() => {
    setLogo(
      "https://images.vexels.com/media/users/3/142789/isolated/preview/2bfb04ad814c4995f0c537c68db5cd0b-multicolor-swirls-circle-logo.png"
    );
    getProperties();
  }, []);

  return (
    <>
      <Navbar
        logo={logo}
        features={["Properties", "Map of Properties", "Contact"]}
      />
      <List properties={properties} />
    </>
  );
}

export default App;
