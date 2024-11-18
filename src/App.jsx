import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MealList from "./components/MealList";

const App = () => {
  return (
    <Router future={{ v7_startTransition: true }}>
      <Routes>
        <Route path="/" element={<MealList />} />
      </Routes>
    </Router>
  );
};

export default App;
