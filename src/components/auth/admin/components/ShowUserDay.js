import React, { useEffect, useState } from 'react';
import { ADMIN_URL } from "../../../../config/user/host-config";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './ShowUserChart.module.scss';

const ShowUserDay = () => {
    const [dayUserCounts, setDayUserCounts] = useState([]);

    useEffect(() => {
        const getDayUserCounts = async () => {
            try {
                const response = await fetch(`${ADMIN_URL}/users/count/today`);
                const result = await response.json();
                setDayUserCounts(result.map((count, index) => ({ day: `Day ${index + 1}`, count }))); // 서버에서 반환하는 JSON 구조에 맞게 수정
            } catch (error) {
                console.error("Failed to fetch user counts:", error);
            }
        };

        getDayUserCounts();
    }, []);

    return (
        <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={dayUserCounts}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ShowUserDay;