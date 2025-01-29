import React, { useState, useEffect } from 'react';
import classes from './practicebalance.module.css';
import Summary from '../summary';
import Distribute from '../paymentDistribute';

const Practice = () => {
    const [friends, setFriends] = useState([]);
    const [currentFriend, setCurrentFriend] = useState({ name: '', expense: '', type: '' });
    const [selectedFriendIndex, setSelectedFriendIndex] = useState(null);
    const [additionalExpense, setAdditionalExpense] = useState({ amount: '', type: '' });

    // Retrieve data from localStorage after the component mounts
    useEffect(() => {
        const savedFriends = localStorage.getItem('friends');
        if (savedFriends) {
            setFriends(JSON.parse(savedFriends));
        }
    }, []);

    // Save to localStorage whenever friends array changes
    useEffect(() => {
        localStorage.setItem('friends', JSON.stringify(friends));
    }, [friends]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentFriend({ ...currentFriend, [name]: value });
    };

    const handleAddFriend = () => {
        if (currentFriend.name && currentFriend.expense && currentFriend.type) {
            setFriends([
                ...friends,
                {
                    name: currentFriend.name,
                    expenses: [{ amount: parseFloat(currentFriend.expense), type: currentFriend.type }]
                }
            ]);
            setCurrentFriend({ name: '', expense: '', type: '' });
        } else {
            alert('Please fill in all the fields');
        }
    };

    const handleAddExpense = (index) => {
        if (additionalExpense.amount && additionalExpense.type) {
            const updatedFriends = [...friends];
            updatedFriends[index].expenses.push({
                amount: parseFloat(additionalExpense.amount),
                type: additionalExpense.type
            });
            setFriends(updatedFriends);
            setAdditionalExpense({ amount: '', type: '' });
            setSelectedFriendIndex(null);
        } else {
            alert('Please enter both expense and type');
        }
    };

    const handleToggleExpenseInput = (index) => {
        if (selectedFriendIndex === index) {
            setSelectedFriendIndex(null);  // Close if it's already open
        } else {
            setSelectedFriendIndex(index);  // Open if closed
        }
    };

    const handleClearAll = () => {
        setFriends([]);
        localStorage.removeItem('friends');  // Clear from local storage too
    };

    const calculateTotalAmount = () => {
        return friends.reduce(
            (total, friend) => total + friend.expenses.reduce((sum, expense) => sum + expense.amount, 0),
            0
        );
    };

    const calculateAverageAmount = () => {
        const total = calculateTotalAmount();
        return friends.length > 0 ? total / friends.length : 0;
    };

    const calculateFriendTotalExpense = (expenses) => {
        return expenses.reduce((sum, expense) => sum + expense.amount, 0);
    };

    const giveTakeAmount = (friend) => {
        const totalExpense = calculateFriendTotalExpense(friend.expenses);
        const averageAmount = calculateAverageAmount();
        return totalExpense - averageAmount;
    };

    const calculateDistribution = () => {
        const averageAmount = calculateAverageAmount();
        const contributions = friends.map(friend => {
            const totalExpense = calculateFriendTotalExpense(friend.expenses);
            return { name: friend.name, paid: totalExpense, shouldPay: averageAmount };
        });

        const payers = contributions.filter(c => c.paid > c.shouldPay);
        const receivers = contributions.filter(c => c.paid < c.shouldPay);

        let distribution = [];

        for (let payer of payers) {
            for (let receiver of receivers) {
                const payerExcess = payer.paid - payer.shouldPay;
                const receiverDeficit = receiver.shouldPay - receiver.paid;
                if (payerExcess > 0 && receiverDeficit > 0) {
                    const transferAmount = Math.min(payerExcess, receiverDeficit);
                    distribution.push(`${receiver.name} needs to pay ${payer.name} ₹${transferAmount.toFixed(2)}`);
                    payer.paid -= transferAmount;
                    receiver.paid += transferAmount;
                }
            }
        }

        return distribution;
    };

    return (
        <div className={`${classes.respoPadding} p-6 bg-gray-50 min-h-screen`}>
            <div>
                <p className={classes.heading}>True Balance</p>

                {/* Add Friend Section */}
                <div className='bg-white shadow-md rounded-lg p-6 mb-6'>
                    <div className={`${classes.inputMain} flex gap-4 flex-wrap`}>
                        <div className='flex flex-col'>
                            <label className='font-semibold mb-1 capitalize'>Name:</label>
                            <input 
                                type="text"
                                name="name"
                                className='border border-gray-300 rounded p-1'
                                value={currentFriend.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='flex flex-col'>
                            <label className='font-semibold mb-1'>Expense:</label>
                            <input
                                type="number"
                                name="expense"
                                className='border border-gray-300 rounded p-1'
                                value={currentFriend.expense}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='flex flex-col'>
                            <label className='font-semibold mb-1'>For:</label>
                            <input
                                type="text"
                                name="type"
                                className='border border-gray-300 rounded p-1'
                                value={currentFriend.type}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <button onClick={handleAddFriend} className='mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
                        Add Friend
                    </button>
                </div>

                {/* Summary Component below the Add Friend button */}
                <Summary
                    totalAmount={calculateTotalAmount()}
                    averageAmount={calculateAverageAmount()}
                    handleClearAll={handleClearAll}
                />

                {/* Friends List Section */}
                <h3 className='text-xl font-bold mb-4'>Friends List</h3>
                <div className='w-full'>
    <div className='bg-white shadow-md rounded-lg p-6 mb-6 overflow-auto'>
        <div className={`${classes.hidescroll} overflow-auto`}>
            <div className="space-y-4">
                {friends.map((friend, index) => (
                    <div key={index} className="border p-4 rounded-lg bg-gray-50">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="capitalize font-semibold text-[30px] ">{friend.name}</h3>
                            <div className="font-semibold">
                                Spent: ₹ {calculateFriendTotalExpense(friend.expenses).toFixed(2)}
                            </div>
                        </div>

                        <ul className="mb-4">
                            {friend.expenses.map((expense, i) => (
                                <li key={i}>₹ {expense.amount.toFixed(2)} - {expense.type}</li>
                            ))}
                        </ul>

                        {selectedFriendIndex === index && (
                            <div className=' mt-2'>
                                <input
                                    type="number"
                                    className='border border-gray-300 rounded p-1 mr-2'
                                    value={additionalExpense.amount}
                                    onChange={(e) => setAdditionalExpense({ ...additionalExpense, amount: e.target.value })}
                                    placeholder="Expense"
                                />
                                <input
                                    type="text"
                                    className='border border-gray-300 rounded p-1 mr-2'
                                    value={additionalExpense.type}
                                    onChange={(e) => setAdditionalExpense({ ...additionalExpense, type: e.target.value })}
                                    placeholder="Type"
                                />
                                <button onClick={() => handleAddExpense(index)} className='px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600'>
                                    Save
                                </button>
                            </div>
                        )}

                        <button
                            onClick={() => handleToggleExpenseInput(index)}
                            className={`mt-2 px-2 py-1 ${selectedFriendIndex === index ? 'bg-red-500' : 'bg-yellow-500'} text-white rounded hover:bg-yellow-600`}
                        >
                            {selectedFriendIndex === index ? 'Close' : 'Add More Expenses'}
                        </button>

                        <div
                            className='mt-4 text-center font-semibold'
                            style={{
                                color: giveTakeAmount(friend) >= 0 ? 'green' : 'red',
                                fontWeight: 'bold'
                            }}
                        >
                            {giveTakeAmount(friend).toFixed(2)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
</div>


                {/* Distribute Component */}
                <Distribute calculateDistribution={calculateDistribution} />
            </div>
        </div>
    );
};

export default Practice;
