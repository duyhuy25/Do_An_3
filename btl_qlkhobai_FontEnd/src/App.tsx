import { useState } from "react";
import Header from "./component/header";
import Sidebar from "./component/sidebar";
import Footer from "./component/footer";

import Containers from "./pages/Containers";
import ContainerHistory from "./pages/Containerhistory";
import ItemTypes from "./pages/ItemTypes";
import Warehouses from "./pages/Warehouses";
import AssignmentContainers from "./pages/AssignmentContainers";
import AuditLogs from "./pages/AuditLog";
import GPSContainers from "./pages/GPSContainers";
import Suppliers from "./pages/Suppliers";
import Maintenance from "./pages/Maintenance";

import "./App.css";
import Vehicles from "./pages/Vehicles";
import Trips from "./pages/Trips";
import Ports from "./pages/Ports";
import Customers from "./pages/Customers";
import Contracts from "./pages/Contracts";
import Costs from "./pages/Costs";
import Invoices from "./pages/Invoices";
import Users from "./pages/Users";
import Dashboard from "./pages/Dashboard";

function App() {

  const [module, setModule] = useState<string>("containers");

  const renderModule = () => {
    switch (module) {

      case "containers":
        return <Containers />;

      case "containerhistory":
        return <ContainerHistory />;
      case "itemtypes":
          return <ItemTypes />;
      case "warehouses":
          return <Warehouses />;
      case "vehicles":
          return <Vehicles />;
      case "trips":
          return <Trips/>
      case "ports":
        return <Ports/>
      case "customers":
        return <Customers/>
      case "contracts":
        return <Contracts/>
      case "costs":
        return <Costs/>
      case "invoices":
        return <Invoices/>
      case "users":
        return <Users/>
      case "dashboard":
        return <Dashboard/>
      case "assignmentcontainers":
        return <AssignmentContainers/>
      case "auditlogs":
        return <AuditLogs/>
      case "gpscontainers":
        return <GPSContainers/>
      case "maintenance":
        return <Maintenance/>
      case "suppliers":
        return <Suppliers/>

      default:
        return <h2>Chưa có dữ liệu</h2>;
    }
  };

  return (
    <div className="app">
  
      <Header />
  
      <div className="container">
  
        <Sidebar onSelect={setModule} />
  
        <div className="main-content">
          {renderModule()}
        </div>
  
      </div>
  
      <Footer />
  
    </div>
  );
}

export default App;