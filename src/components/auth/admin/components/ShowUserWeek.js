import React, { useEffect, useState } from 'react';
import { ADMIN_URL } from "../../../../config/user/host-config";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './ShowUserChart.module.scss';

const ShowUserWeek = () => {
    const [weekUserCounts, setWeekUserCounts] = useState([]);

    useEffect(() => {
        const getWeekUserCounts = async () => {
            try {
                const response = await fetch(`${ADMIN_URL}/users/count/weeks`);
                const result = await response.json();
                setWeekUserCounts(result.map((count, index) => ({ week: `Week ${index + 1}`, count }))); // 서버에서 반환하는 JSON 구조에 맞게 수정
            } catch (error) {
                console.error("Failed to fetch user counts:", error);
            }
        };

        getWeekUserCounts();
    }, []);

    return (
        <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={weekUserCounts}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ShowUserWeek;