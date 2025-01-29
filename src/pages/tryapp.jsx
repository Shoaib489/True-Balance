import React, { useState } from 'react';

const TaskList = () => {
    const [name, setName] = useState("");
    const [num, setNum] = useState("");
    const [item, setItem] = useState("");
    const [tasks, setTasks] = useState([]);

    // States to handle additional expense inputs
    const [additionalAmount, setAdditionalAmount] = useState({});
    const [additionalItem, setAdditionalItem] = useState({});
    const [showExpenseForm, setShowExpenseForm] = useState({});

    const addTask = () => {
        if (name.trim() && num.trim()) {
            setTasks([...tasks, { name, num: parseFloat(num), item, additionalExpenses: [] }]);
            setName("");
            setNum("");
            setItem("");
        }
    };

    const deleteTask = (index) => {
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
    };

    const calculateTotalAmount = () => {
        return tasks.reduce((total, task) => {
            const additionalTotal = task.additionalExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
            return total + task.num + additionalTotal;
        }, 0);
    };

    const calculateAverage = () => {
        const totalAmount = calculateTotalAmount();
        const numberOfTasks = tasks.length;
        return numberOfTasks > 0 ? totalAmount / numberOfTasks : 0;
    };

    const addMoreExpense = (index) => {
        if (additionalAmount[index] && additionalItem[index]) {
            const updatedTasks = tasks.map((task, i) => {
                if (i === index) {
                    return {
                        ...task,
                        additionalExpenses: [...task.additionalExpenses, { amount: parseFloat(additionalAmount[index]), item: additionalItem[index] }]
                    };
                }
                return task;
            });
            setTasks(updatedTasks);
            setAdditionalAmount({ ...additionalAmount, [index]: '' });
            setAdditionalItem({ ...additionalItem, [index]: '' });
            setShowExpenseForm({ ...showExpenseForm, [index]: false });
        }
    };

    const toggleExpenseForm = (index) => {
        setShowExpenseForm({ ...showExpenseForm, [index]: !showExpenseForm[index] });
    };

    return (
        <div className="p-4 max-w-lg">

            <div className="flex justify-between mb-4">
                <div className="w-1/2">
                    <input
                        type="text"
                        placeholder="Enter name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border border-gray-300 p-2 rounded-md w-full mb-2"
                    />
                    <input
                        type="number"
                        placeholder="Enter amount"
                        value={num}
                        onChange={(e) => setNum(e.target.value)}
                        className="border border-gray-300 p-2 rounded-md w-full mb-2"
                    />
                    <input
                        type="text"
                        placeholder="Item Name"
                        value={item}
                        onChange={(e) => setItem(e.target.value)}
                        className="border border-gray-300 p-2 rounded-md w-full mb-2"
                    />
                </div>

                <div className="w-1/2 text-right">
                    <div className="border border-gray-300 p-4 rounded-lg">
                        <div>
                            <p className="font-semibold">Total Amount:</p>
                            <p>{calculateTotalAmount()}</p>
                        </div>
                        <div className="mt-2">
                            <p className="font-semibold">Average Amount:</p>
                            <p>{calculateAverage().toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={addTask}
                className="bg-blue-500 text-white p-2 rounded-md w-full mb-4"
            >
                Add Task
            </button>

            <p className="text-xl font-semibold mb-2">Task List</p>
            <ul className="list-disc">
                {tasks.map((task, index) => {
                    const additionalTotal = task.additionalExpenses.reduce((sum, expense) => sum + expense.amount, 0);
                    const totalAmount = task.num + additionalTotal;
                    const averageAmount = calculateAverage();
                    const difference = totalAmount - averageAmount;
                    const differenceColor = difference < 0 ? 'text-red-500' : 'text-green-500';

                    return (
                        <li key={index} className="flex flex-col justify-between mb-4 p-4 border border-gray-300 rounded-md">
                            <div className="flex justify-between">
                                <div>
                                    <h3 className="text-lg font-medium">{task.name}</h3>
                                    <div>
                                        <p className={`${differenceColor} font-semibold`}>
                                            Amount Distribution: {difference.toFixed(2)}
                                        </p>
                                        {/* <p className="text-gray-600"> Rs. {task.num}</p> */}
                                        <p>Item: {task.item}  Rs. {task.num}</p>
                                    </div>

                                    
                                </div>
                                <button
                                    onClick={() => deleteTask(index)}
                                    className="bg-red-500 text-white p-1 rounded-md w-14 h-8"
                                >
                                    Delete
                                </button>
                            </div>

                            <div className="mt-4">
                                <h4 className="font-semibold">Additional Expenses:</h4>
                                <ul className="list-disc ml-4">
                                    {task.additionalExpenses.map((expense, i) => (
                                        <li key={i}>
                                            <p>Amount: {expense.amount}, Item: {expense.item}</p>
                                        </li>
                                    ))}
                                </ul>
                                <p>Total Task Amount: {totalAmount.toFixed(2)}</p>
                            </div>

                            <button
                                onClick={() => toggleExpenseForm(index)}
                                className="bg-gray-300 text-gray-800 p-2 rounded-md mt-2"
                            >
                                {showExpenseForm[index] ? 'Hide' : 'Add More Expenses'}
                            </button>

                            {showExpenseForm[index] && (
                                <div className="mt-4 flex gap-2">
                                    <input
                                        type="number"
                                        placeholder="Additional Amount"
                                        value={additionalAmount[index] || ''}
                                        onChange={(e) => setAdditionalAmount({ ...additionalAmount, [index]: e.target.value })}
                                        className="border border-gray-300 p-2 rounded-md w-1/2"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Additional Item"
                                        value={additionalItem[index] || ''}
                                        onChange={(e) => setAdditionalItem({ ...additionalItem, [index]: e.target.value })}
                                        className="border border-gray-300 p-2 rounded-md w-1/2"
                                    />
                                    <button
                                        onClick={() => addMoreExpense(index)}
                                        className="bg-green-500 text-white p-2 rounded-md"
                                    >
                                        Add
                                    </button>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default TaskList;
