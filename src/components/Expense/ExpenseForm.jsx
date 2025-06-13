import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../utils/api";
import { toast } from "react-toastify";

export default function ExpenseForm() {
  const { register, handleSubmit, setValue } = useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const fetchExpenseById = async () => {
      setLoader(true);
      try {
        const res = await API.get(`/expenses/?id=${id}`);
        const data = res.data;
        setValue("amount", data.amount);
        setValue("category", data.category);
        setValue("date", data.date?.substring(0, 10));
        setValue("description", data.description);
      } catch (error) {
        console.error("Error fetching expense by ID:", error);
        toast.error("Failed to load expense data.");
      } finally {
        setLoader(false);
      }
    };

    if (id) {
      fetchExpenseById();
    }
  }, [id, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      data.amount = parseFloat(data.amount);

      if (id) {
        await API.put(`/expenses/update/${id}`, data);
        toast.success("Expense updated successfully!");
      } else {
        await API.post("/expenses/add", data);
        toast.success("Expense added successfully!");
      }

      navigate("/expense");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Error submitting expense:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {id ? "Edit" : "Add"} Expense
      </h2>
      {loader ? (
        <div className="flex justify-center my-5">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white space-y-4">
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Amount
            </label>
            <input
              id="amount"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              {...register("amount")}
              placeholder="Amount"
              type="number"
            />
          </div>
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <select
              id="category"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              {...register("category")}
            >
              <option value="">Select category</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Utilities">Utilities</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Health">Health</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Date
            </label>
            <input
              id="date"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              {...register("date")}
              type="date"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              {...register("description")}
              placeholder="Description"
            />
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/expense")}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              {loading ? (
                <div className="flex justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              ) : id ? (
                "Update"
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
