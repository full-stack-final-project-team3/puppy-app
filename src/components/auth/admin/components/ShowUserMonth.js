import React, { useEffect, useState } from 'react';
import { ADMIN_URL } from "../../../../config/user/host-config";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './ShowUserChart.module.scss';

const ShowUserMonth = () => {
    const [monthUserCounts, setMonthUserCounts] = useState([]);

    useEffect(() => {
        const getMonthUserCounts = async () => {
            try {
                const response = await fetch(`${ADMIN_URL}/users/count/months`);
                const result = await response.json();
                setMonthUserCounts(result.map((count, index) => ({ month: `Month ${index + 1}`, count }))); // 서버에서 반환하는 JSON 구조에 맞게 수정
            } catch (error) {
                console.error("Failed to fetch user counts:", error);
            }
        };

        getMonthUserCounts();
    }, []);

    return (
        <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart
                    data={monthUserCounts}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#82ca9d" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ShowUserMonth;