import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import API from "../utils/api";

ChartJS.register(ArcElement, Tooltip, Legend);

const CATEGORIES = [
  "Food",
  "Transport",
  "Utilities",
  "Entertainment",
  "Health",
  "Other",
];
const COLORS = [
  "#34D399",
  "#60A5FA",
  "#F59E0B",
  "#F43F5E",
  "#6366F1",
  "#10B981",
];

const Dashboard = () => {
  const [categoryTotals, setCategoryTotals] = useState({});
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await API.get("/expenses");
      const data = res.data;

      const totals = {};
      let sum = 0;

      data.forEach((expense) => {
        const category = CATEGORIES.includes(expense.category)
          ? expense.category
          : "Other";
        totals[category] = (totals[category] || 0) + Number(expense.amount);
        sum += Number(expense.amount);
      });

      setCategoryTotals(totals);
      setTotal(sum);
    } catch (err) {
      console.error("Error fetching expenses", err);
    }
  };

  const chartData = {
    labels: CATEGORIES,
    datasets: [
      {
        data: CATEGORIES.map((cat) => categoryTotals[cat] || 0),
        backgroundColor: COLORS,
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ₹${context.raw}`,
        },
      },
      legend: {
        position: "bottom",
        labels: {
          color: "#374151",
          boxWidth: 15,
        },
      },
    },
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-4 mb-6 gap-6">
        <div className="col-span-1">
          <div className="w-full  bg-white rounded-lg p-4 shadow">
            <div className="flex flex-col items-center justify-center pointer-events-none mb-3">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-xl font-bold text-green-600">₹{total}</p>
            </div>
            <div className="h-[320px]">
              <Pie data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
        <div className="col-span-3">
          <div className="gap-3 grid grid-cols-2 h-full">
            {CATEGORIES.map((cat, i) => (
              <div
                key={cat}
                className="bg-white rounded-lg shadow p-4 border-l-4"
                style={{ borderColor: COLORS[i] }}
              >
                <h2 className="text-lg font-semibold text-gray-700">{cat}</h2>
                <p className="text-xl text-gray-900 font-bold">
                  ₹{categoryTotals[cat] || 0}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
