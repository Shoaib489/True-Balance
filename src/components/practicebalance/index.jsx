import React, { useState } from 'react';
import classes from "./practicebalance.module.css"; // Assuming you have the styles already

const Practice = () => {
    const [friends, setFriends] = useState([]);
    const [currentFriend, setCurrentFriend] = useState({ name: '', expense: '' });
    const [selectedFriendIndex, setSelectedFriendIndex] = useState(null);
    const [additionalExpense, setAdditionalExpense] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentFriend({ ...currentFriend, [name]: value });
    };

    const handleAddFriend = () => {
        if (currentFriend.name && currentFriend.expense) {
            setFriends([...friends, { name: currentFriend.name, expenses: [parseFloat(currentFriend.expense)] }]);
            setCurrentFriend({ name: '', expense: '' });
        } else {
            alert('Please fill in both fields');
        }
    };

    const handleAddExpense = (index) => {
        if (additionalExpense) {
            const updatedFriends = [...friends];
            updatedFriends[index].expenses.push(parseFloat(additionalExpense));
            setFriends(updatedFriends);
            setAdditionalExpense('');
            setSelectedFriendIndex(null);
        } else {
            alert('Please enter an expense');
        }
    };

    const calculateTotalAmount = () => {
        return friends.reduce((total, friend) =>
            total + friend.expenses.reduce((sum, expense) => sum + expense, 0),
            0
        );
    };

    const calculateAverageAmount = () => {
        const total = calculateTotalAmount();
        return friends.length > 0 ? total / friends.length : 0;
    };

    const calculateFriendTotalExpense = (expenses) => {
        return expenses.reduce((sum, expense) => sum + expense, 0);
    };

    const giveTakeAmount = (friend) => {
        const totalExpense = calculateFriendTotalExpense(friend.expenses);
        const averageAmount = calculateAverageAmount();
        return totalExpense - averageAmount;
    };

    const calculateDistribution = () => {
        const totalAmount = calculateTotalAmount();
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
                    distribution.push(`${receiver.name} pays ${payer.name} $${transferAmount.toFixed(2)}`);
                    payer.paid -= transferAmount;
                    receiver.paid += transferAmount;
                }
            }
        }

        return distribution;
    };

    return (
        <div className={` ${classes.respoPadding} p-6 bg-gray-50 min-h-screen`}>
            <div className='max-w-2xl'>
                <p className={classes.heading}>True Balance</p>
                <div className='bg-white shadow-md rounded-lg p-6 mb-6 flex justify-between flex-wrap'>
                    <div className={`${classes.inputMain} flex gap-4 flex-wrap`}>
                        <div className='flex flex-col'>
                            <label className='font-semibold mb-1'>Name:</label>
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

                    </div>
                    <button onClick={handleAddFriend} className='mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>Add Friend</button>
                </div>
                <div>
                    <div className='bg-white shadow-md rounded-lg p-6 mb-6'>
                        <h3 className='text-xl font-bold mb-4'>Friends List</h3>
                        <table className='w-full border-collapse'>
                            <thead>
                                <tr className='bg-gray-200'>
                                    <th className='border p-2 text-left'>Name</th>
                                    <th className='border p-2 text-left'>Expenses</th>
                                    <th className='border p-2 text-left'><span className='text-[red]'>Give</span> / <span className='text-[green]'>Take</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {friends.map((friend, index) => (
                                    <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                        <td className='border p-2 capitalize'>{friend.name}</td>
                                        <td className='border p-2'>
                                            <ul>
                                                {friend.expenses.map((expense, i) => (
                                                    <li key={i}>${expense.toFixed(2)}</li>
                                                ))}
                                                {selectedFriendIndex === index && (
                                                    <li className='flex items-center mt-2'>
                                                        <input
                                                            type="number"
                                                            className='border border-gray-300 rounded p-1 mr-2'
                                                            value={additionalExpense}
                                                            onChange={(e) => setAdditionalExpense(e.target.value)}
                                                        />
                                                        <button onClick={() => handleAddExpense(index)} className='px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600'>Save</button>
                                                    </li>
                                                )}
                                            </ul>
                                            <div className='mt-2 font-semibold'>
                                                 Spent: ${calculateFriendTotalExpense(friend.expenses).toFixed(2)}
                                            </div>
                                            {selectedFriendIndex !== index && (
                                                <button onClick={() => setSelectedFriendIndex(index)} className='mt-2 px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600'>Add Expense</button>
                                            )}
                                        </td>
                                        <td
                                            className='border p-2'
                                            style={{
                                                color: giveTakeAmount(friend) >= 0 ? 'green' : 'red',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {giveTakeAmount(friend).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className='bg-white shadow-md rounded-lg p-6 mb-6'>
                        <h3 className='text-xl font-bold mb-4'>Summary</h3>
                        <p className='mb-2'>Total Amount: <span className='font-semibold'>${calculateTotalAmount().toFixed(2)}</span></p>
                        <p className='mb-2'>Average Amount: <span className='font-semibold'>${calculateAverageAmount().toFixed(2)}</span></p>
                    </div>
                </div>
                <div className='bg-white shadow-md rounded-lg p-6'>
                    <h3 className='text-xl font-bold mb-4'>Payment Distribution</h3>
                    <ul className='list-disc pl-6'>
                        {calculateDistribution().map((line, index) => (
                            <li key={index} className='mb-1'>{line}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Practice