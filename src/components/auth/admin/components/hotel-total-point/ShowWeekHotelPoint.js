import React, { useEffect, useState } from 'react';
import { ADMIN_URL } from "../../../../../config/user/host-config";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment';

const ShowWeekHotelPoint = () => {
    const [weekHotelPoint, setWeekHotelPoint] = useState([]);

    useEffect(() => {
        const fetchWeekHotelPoint = async () => {
            try {
                const response = await fetch(`${ADMIN_URL}/expenses/reservations/weekly`);
                const result = await response.json();

                const formattedData = result.map((count, index) => {
                    const weekStart = moment().subtract(3 - index, 'weeks').startOf('week').format('YYYY [Week] WW');
                    return { week: weekStart, count };
                });

                setWeekHotelPoint(formattedData);
            } catch (error) {
                console.error("Failed to fetch weekly hotel point data:", error);
            }
        };

        fetchWeekHotelPoint();
    }, []);

    return (
        <div>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={weekHotelPoint}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 10,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis tickFormatter={(value) => `${value.toLocaleString()}`} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884D8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ShowWeekHotelPoint;