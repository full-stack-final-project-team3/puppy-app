import React, { useEffect, useState } from 'react';
import { ADMIN_URL } from "../../../../config/user/host-config";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './ShowUserChart.module.scss';
import moment from 'moment';

const ShowUserMonth = () => {
    const [monthUserCount, setMonthUserCount] = useState([]);

    useEffect(() => {
        const getMonthUserCounts = async () => {
            try {
                const response = await fetch(`${ADMIN_URL}/users/cumulative/month`);
                const result = await response.json();

                // 오늘 날짜를 기준으로 각 월을 계산하여 포맷
                const formattedData = result.map((count, index) => {
                    const month = moment().subtract(index, 'months').format('YYYY-MM');
                    return { month: month, count };
                });

                // 최신 데이터가 오른쪽에 위치하도록 배열 반전
                setMonthUserCount(formattedData.reverse());
            } catch (error) {
                console.error("Failed to fetch user counts:", error);
            }
        };

        getMonthUserCounts();
    }, []);

    return (
        <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={monthUserCount}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
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

export default ShowUserMonth;