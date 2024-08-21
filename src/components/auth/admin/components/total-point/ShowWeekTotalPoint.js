import React, { useEffect, useState } from 'react';
import { ADMIN_URL } from "../../../../../config/user/host-config";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from '../ShowUserChart.module.scss';
import moment from 'moment';

const ShowWeekTotalPoint = () => {
    const [weekTotalPoint, setWeekTotalPoint] = useState([]);

    useEffect(() => {
        const fetchWeekTotalPoint = async () => {
            try {
                const response = await fetch(`${ADMIN_URL}/expenses/weekly`);
                const result = await response.json();

                // 날짜 형식을 'YYYY Week WW'로 변환
                const formattedData = result.map((count, index) => {
                    const week = moment().subtract(3 - index, 'weeks').startOf('isoWeek').format('YYYY [Week] WW');
                    return { week, count };
                });

                setWeekTotalPoint(formattedData);
            } catch (error) {
                console.error("Failed to fetch weekly total points:", error);
            }
        };

        fetchWeekTotalPoint();
    }, []);

    return (
        <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={weekTotalPoint}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 10,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="week"
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

export default ShowWeekTotalPoint;