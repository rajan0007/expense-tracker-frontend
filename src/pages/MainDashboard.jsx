import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

const MainDashboard = () => {
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const location = useLocation();

  const colors = {
    active: "bg-green-100 text-green-700 font-semibold",
    inactive: "text-gray-700 hover:bg-green-100",
  };

  const isExpenseActive =
    location.pathname.startsWith("/expense") ||
    location.pathname.startsWith("/expense-add");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-0"
        } relative bg-white border-r border-gray-300 transition-all duration-300 shadow-md`}
      >
        {isSidebarOpen && (
          <div className="p-4">
            <h2 className="text-xl font-bold text-green-600 mb-6">
              My Tracker
            </h2>
            <nav className="space-y-2 text-sm">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `block w-full text-left text-lg px-4 py-2 rounded ${
                    isActive ? colors.active : colors.inactive
                  }`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/expense"
                className={`block w-full text-lg text-base px-4 py-2 rounded ${
                  isExpenseActive ? colors.active : colors.inactive
                }`}
              >
                Expenses
              </NavLink>
            </nav>
          </div>
        )}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-5 top-6 bg-green-500 hover:bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md z-10 transition-all duration-200"
        >
          {isSidebarOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
        </button>
      </div>
      <div className="flex-1 p-6">
        <div className="flex justify-end mb-4">
          <button
            type="button"
            className="bg-red-700 hover:bg-red-400 text-white px-4 py-2 rounded"
            onClick={handleLogout}
          >
            LogOut
          </button>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default MainDashboard;
