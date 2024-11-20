import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MealList from "./components/MealList";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <Router future={{ v7_startTransition: true }}>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<MealList />} />
      </Routes>
    </Router>
  );
};

export default App;
