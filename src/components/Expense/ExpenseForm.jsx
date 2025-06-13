import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import API from "../../utils/api";
import { toast } from "react-toastify";

export default function ExpenseForm() {
  const { register, handleSubmit, setValue } = useForm();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      API.get(`/expenses/?id=${id}`).then((res) => {
        const data = res.data;
        setValue("amount", data.amount);
        setValue("category", data.category);
        setValue("date", data.date?.substring(0, 10));
        setValue("description", data.description);
      });
    }
  }, [id, setValue]);

  const onSubmit = async (data) => {
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
    }
  };

  return (
    <div className="mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {id ? "Edit" : "Add"} Expense
      </h2>
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
            {id ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
