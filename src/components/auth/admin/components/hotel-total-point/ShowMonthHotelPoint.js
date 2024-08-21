import React, { useEffect, useState } from 'react';
import { ADMIN_URL } from "../../../../../config/user/host-config";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment';

const ShowMonthHotelPoint = () => {
    const [monthHotelPoint, setMonthHotelPoint] = useState([]);

    useEffect(() => {
        const fetchMonthHotelPoint = async () => {
            try {
                const response = await fetch(`${ADMIN_URL}/expenses/reservations/monthly`);
                const result = await response.json();

                const formattedData = result.map((count, index) => {
                    const month = moment().subtract(11 - index, 'months').format('YYYY-MM');
                    return { month, count };
                });

                setMonthHotelPoint(formattedData);
            } catch (error) {
                console.error("Failed to fetch monthly hotel point data:", error);
            }
        };

        fetchMonthHotelPoint();
    }, []);

    return (
        <div>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={monthHotelPoint}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 10,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `${value.toLocaleString()}`} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884D8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ShowMonthHotelPoint;