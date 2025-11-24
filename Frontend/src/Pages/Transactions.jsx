import { useState } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import { addbudget, addtransaction } from "../Features/UserSlice";
import { useDispatch, useSelector } from "react-redux";

const Transactions = () => {
  const dispatch= useDispatch();
  const { status, error, isLoggedIn } = useSelector((state) => state.user);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false); // <-- toggle add form
  const [showForm1, setShowForm1]= useState(false);
  // const [transactions, setTransactions] = useState([
  //   { id: 1, type: "income", amount: 5000, category: "Salary", date: "2025-01-10", note: "January Salary" },
  //   { id: 2, type: "expense", amount: 1200, category: "Food", date: "2025-01-12", note: "Groceries" },
  //   { id: 3, type: "income", amount: 2000, category: "Freelance", date: "2025-01-13", note: "React project" },
  //   { id: 4, type: "expense", amount: 800, category: "Transport", date: "2025-01-15", note: "Fuel" },
  // ]);

  const budgets = useSelector((state) => state.user.budgets);

  const transactions = useSelector((state) => state.user.transactions)

  const [newTx, setNewTx] = useState({
    type: "income",
    amount: "",
    category: "",
    date: "",
    note: "",
  });
  

  const [newbd, setnewbd] =useState({
     category: "",
     limit: "",
     spent: ""
  });

  // FILTER & SEARCH LOGIC
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.note.toLowerCase().includes(search.toLowerCase()) ||
      tx.category.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filter === "all" || tx.type === filter;

    return matchesSearch && matchesFilter;
  });

  // Handle new transaction input change
  const handleNewTxChange = (e) => {
    const { name, value } = e.target;
    setNewTx((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewbdChange =(e) => {
    const {name,value} =e.target;
    setnewbd((prev) => ({...prev,[name]:value}));
  }

  // Add transaction handler
  const handleAddTransaction = (e) => {
    e.preventDefault();

    // Simple validation
    if (!newTx.amount || !newTx.category || !newTx.date || !newTx.note) {
      alert("Please fill in all fields!");
      return;
    }

    const txToAdd = {
      ...newTx,
      id: crypto.randomUUID(),
      amount: parseFloat(newTx.amount),
    };
    

    dispatch({
      type: 'user/addLocalTransaction',
      payload: txToAdd
    })

    dispatch(addtransaction({
        type: txToAdd.type,
        date: txToAdd.date,
        category: txToAdd.category,
        amount : txToAdd.amount,
        note: txToAdd.note
    }))


    // setTransactions((prev) => [txToAdd, ...prev]);
    setNewTx({ type: "income", amount: "", category: "", date: "", note: "" });
    setShowForm(false);
  };

  const handleAddbudget= (e) =>{
       e.preventDefault();

       if(!newbd.category || !newbd.spent || !newbd.limit)
       {
        alert("please fill in all fields.")
        return;
       }

       const bdtoadd ={
        ...newbd,
        id: crypto.randomUUID(),
        limit: parseFloat(newbd.limit),
        spent: parseFloat(newbd.spent)
       }

       dispatch({
        type: 'user/addLocalbudget',
        payload: bdtoadd
       })

       dispatch(addbudget({
        category: bdtoadd.category,
        limit:bdtoadd.limit,
        spent:bdtoadd.spent
       }));
       
       setnewbd({category:"",limit:"",spent:""})
       setShowForm1(false);
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6 rounded-xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Transactions</h1>

      {/* SEARCH + FILTER + ADD */}
      <div className="flex items-center justify-between mb-6">
        {/* Search */}
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow w-1/3">
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search transactions..."
            className="outline-none w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter */}
        <select
          className="bg-white px-4 py-2 rounded-xl shadow"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        {/* Add New Transaction */}
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow hover:bg-blue-700 transition"
        >
          <FaPlus /> Add Transaction
        </button>
      </div>

      {/* ADD TRANSACTION FORM */}
      {showForm && (
        <form
          onSubmit={handleAddTransaction}
          className="bg-white p-6 rounded-xl shadow mb-6 grid grid-cols-1 md:grid-cols-5 gap-4"
        >
          <select
            name="type"
            value={newTx.type}
            onChange={handleNewTxChange}
            className="border rounded-lg px-3 py-2"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={newTx.amount}
            onChange={handleNewTxChange}
            className="border rounded-lg px-3 py-2"
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={newTx.category}
            onChange={handleNewTxChange}
            className="border rounded-lg px-3 py-2"
          />

          <input
            type="date"
            name="date"
            value={newTx.date}
            onChange={handleNewTxChange}
            className="border rounded-lg px-3 py-2"
          />

          <input
            type="text"
            name="note"
            placeholder="Note"
            value={newTx.note}
            onChange={handleNewTxChange}
            className="border rounded-lg px-3 py-2"
          />

          <button
            type="submit"
            className="col-span-1 md:col-span-5 bg-green-600 text-white px-6 py-2 rounded-xl shadow hover:bg-green-700 transition"
          >
            Add
          </button>
        </form>
      )}

      {/* TRANSACTIONS LIST */}
      <div className="bg-white p-6 rounded-xl shadow">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              <th className="py-3">Date</th>
              <th>Category</th>
              <th>Note</th>
              <th>Type</th>
              <th className="text-right">Amount</th>
            </tr>
          </thead>

          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => (
                <tr key={tx._id || tx.id} className="border-b text-gray-700">
                  <td className="py-3">{new Date(tx.date).toLocaleDateString("en-IN")}</td>
                  <td>{tx.category}</td>
                  <td>{tx.note}</td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-xl text-sm ${
                        tx.type === "income"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                    </span>
                  </td>
                  <td
                    className={`text-right font-semibold ${
                      tx.type === "income" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    ₹{tx.amount}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

       {/* Budget List */}
        <div className=" mt-6">
            <div className="flex items-center justify-end mb-6">
              {/* Add New Budget */}
              <button
                onClick={() => setShowForm1((prev) => !prev)}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow hover:bg-blue-700 transition"
              >
                <FaPlus /> Add Budget
              </button>
            </div>
        </div>
        

          {showForm1 && (
        <form
          onSubmit={handleAddbudget}
          className="bg-white p-6 rounded-xl shadow mb-6 flex  md:grid-cols-5 gap-4"
         >
          

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={newbd.category}
            onChange={handleNewbdChange}
            className="border rounded-lg px-3 py-2"
          />
          
          <input
            type="number"
            name="limit"
            placeholder="limit"
            value={newbd.amount}
            onChange={handleNewbdChange}
            className="border rounded-lg px-3 py-2"
          />

          <input
            type="number"
            name="spent"
            placeholder="spent"
            value={newbd.amount}
            onChange={handleNewbdChange}
            className="border rounded-lg px-3 py-2"
          />

          <button
            type="submit"
            className="col-span-1 md:col-span-5 bg-green-600 text-white px-6 py-2 rounded-xl shadow hover:bg-green-700 transition"
          >
            Add
          </button>
        </form>
      )}
      

      <div className="bg-white p-6  rounded-xl shadow">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              <th>Category</th>
              <th>Spent</th>
              <th>Limit</th>
            </tr>
          </thead>

          <tbody>
            {budgets.length > 0 ? (
              budgets.map((bd) => (
                <tr key={bd._id || bd.id} className="border-b  text-gray-700">
                  <td className="p-2 font-semibold">{bd.category}</td>
                  <td className="p-2 text-red-600  font-semibold">₹{bd.spent}</td>
                  <td className="p-2 text-blue-700 font-semibold">₹{bd.limit}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No Budgets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Transactions;
