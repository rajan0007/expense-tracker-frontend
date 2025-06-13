// pages/Expenses.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast } from "react-toastify";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchExpenses = async () => {
    const res = await API.get("/expenses");
    setExpenses(res.data || []);
  };

  const handleDelete = (id) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="bg-white p-6 rounded shadow-lg max-w-sm mx-auto text-center">
            <h2 className="text-xl font-semibold mb-4">Confirm to delete</h2>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete this expense?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={async () => {
                  try {
                    await API.delete(`/expenses/${id}`);
                    toast.success("Expense deleted successfully!");
                    fetchExpenses();
                    onClose();
                  } catch (err) {
                    console.log("err::: ", err);
                    toast.error("Failed to delete expense.");
                    onClose();
                  }
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Yes
              </button>
              <button
                onClick={() => {
                  onClose();
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
              >
                No
              </button>
            </div>
          </div>
        );
      },
    });
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const filtered = expenses.filter((exp) =>
    exp.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">All Expenses</h2>
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => navigate("/expense-add")}
        >
          + Add Expense
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by category"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead className="bg-green-100 text-green-800">
            <tr>
              <th className="py-2 px-4 border">No.</th>
              <th className="py-2 px-4 border">Amount</th>
              <th className="py-2 px-4 border">Category</th>
              <th className="py-2 px-4 border">Date</th>
              <th className="py-2 px-4 border">Description</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No expenses found.
                </td>
              </tr>
            ) : (
              filtered.map((exp, i) => (
                <tr key={exp._id}>
                  <td className="py-2 px-4 border">{i}</td>
                  <td className="py-2 px-4 border">₹{exp.amount}</td>
                  <td className="py-2 px-4 border">{exp.category}</td>
                  <td className="py-2 px-4 border">
                    {new Date(exp.date).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border">{exp.description}</td>
                  <td className="py-2 px-4 border space-x-2">
                    <button
                      onClick={() => navigate(`/expense-add/${exp._id}`)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(exp._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition duration-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
