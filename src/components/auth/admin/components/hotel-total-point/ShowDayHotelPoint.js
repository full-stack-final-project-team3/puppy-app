import React, { useEffect, useState } from 'react';
import { ADMIN_URL } from "../../../../../config/user/host-config";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment';

const ShowDayHotelPoint = () => {
    const [dayHotelPoint, setDayHotelPoint] = useState([]);

    useEffect(() => {
        const fetchDayHotelPoint = async () => {
            try {
                const response = await fetch(`${ADMIN_URL}/expenses/reservations/daily`);
                const result = await response.json();

                const formattedData = result.map((count, index) => {
                    const date = moment().subtract(27 - index, 'days').format('MM/DD');
                    return { date, count };
                });

                setDayHotelPoint(formattedData);
            } catch (error) {
                console.error("Failed to fetch daily hotel point data:", error);
            }
        };

        fetchDayHotelPoint();
    }, []);

    return (
        <div>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={dayHotelPoint}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 10,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis tickFormatter={(value) => `${value.toLocaleString()}`} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884D8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ShowDayHotelPoint;