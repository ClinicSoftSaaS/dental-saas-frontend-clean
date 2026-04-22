import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import PatientView from "./components/PatientView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/doctor" element={<Dashboard />} />
        <Route path="/patient" element={<PatientView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;