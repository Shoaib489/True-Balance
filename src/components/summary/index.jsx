import React from 'react';

const Summary = ({ totalAmount, averageAmount, handleClearAll }) => {
    return (
        <div className='bg-white shadow-md rounded-lg p-6 mb-6 w-[35%]'>
            <h3 className='text-xl font-bold mb-4'>Summary</h3>
            <p className='mb-2'>Total Amount: <span className='font-semibold'>₹ {totalAmount.toFixed(2)}</span></p>
            <p className='mb-2'>Average Amount: <span className='font-semibold'>₹ {averageAmount.toFixed(2)}</span></p>
            <button
                onClick={handleClearAll}
                className='mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
            >
                Clear All
            </button>
        </div>
    );
};

export default Summary;

 