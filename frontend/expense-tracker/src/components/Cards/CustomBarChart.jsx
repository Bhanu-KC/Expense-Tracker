import React from 'react';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import CustomTooltip from '../Charts/CustomTooltip';

const CustomBarChart = ({ data }) => {
    console.log("Bar chart data:", data);

    const getBarColor = (index) => (index % 2 === 0 ? '#875cf5' : '#cfbefb');

    return (
        <div className='bg-white mt-6'>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid stroke="none" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#555' }} stroke='none' />
                    <YAxis tick={{ fontSize: 12, fill: '#555' }} stroke='none' />
                    <Tooltip content={CustomTooltip} />
                    <Bar dataKey="amount" radius={[10, 10, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getBarColor(index)} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CustomBarChart;
