import React, { useEffect, useState } from 'react';
import { ADMIN_URL } from "../../../../../config/user/host-config";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from '../ShowUserChart.module.scss';
import moment from 'moment';

const ShowMonthTotalPoint = () => {
    const [monthTotalPoint, setMonthTotalPoint] = useState([]);

    useEffect(() => {
        const fetchMonthTotalPoint = async () => {
            try {
                const response = await fetch(`${ADMIN_URL}/expenses/monthly`);
                const result = await response.json();

                // 날짜 형식을 'YYYY-MM'로 변환
                const formattedData = result.map((count, index) => {
                    const month = moment().subtract(11 - index, 'months').format('YYYY-MM');
                    return { month, count };
                });

                setMonthTotalPoint(formattedData);
            } catch (error) {
                console.error("Failed to fetch monthly total points:", error);
            }
        };

        fetchMonthTotalPoint();
    }, []);

    return (
        <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={monthTotalPoint}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 10,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="month"
                        tickFormatter={(value = "") => value}
                    />
                    <YAxis
                        tickFormatter={(value = 0) => value.toLocaleString()}
                        interval="preserveEnd"
                    />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ShowMonthTotalPoint;