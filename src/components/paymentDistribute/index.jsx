import React from 'react';

const Distribute = ({ calculateDistribution }) => {

    return (
        <div className='bg-white shadow-md rounded-lg p-6'>
            <h3 className='text-xl font-bold mb-4'>Payment Distribution</h3>
            <ul className='list-disc pl-6'>
                {calculateDistribution().map((line, index) => (
                    <li key={index} className='mb-1'>{line}</li>
                ))}
            </ul>
        </div>
    );
};

export default Distribute;
