import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import MainDashboard from "./pages/MainDashboard";
import ExpenseForm from "./components/Expense/ExpenseForm";
import Expenses from "./components/Expense/Expenses";
import Dashboard from "./components/Dashboard";
import { useAuth } from "./context/AuthContext";

function App() {
  const { authenticated } = useAuth();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {authenticated ? (
          <Route path="/" element={<MainDashboard />}>
            <Route index element={<Dashboard />} />
            <Route path="expense" element={<Expenses />} />
            <Route path="expense-add" element={<ExpenseForm />} />
            <Route path="expense-add/:id" element={<ExpenseForm />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
