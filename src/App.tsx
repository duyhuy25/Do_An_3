import { useState } from "react";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Sidebar from "./components/Sidebar/Sidebar";


function App() {
  const [module, setModule] = useState("containers");
  return (
    <>
      <Header />
      <div className="container">
        <Sidebar onSelect={setModule} />
      </div>
      <Footer />
    </>
  );
}

export default App;