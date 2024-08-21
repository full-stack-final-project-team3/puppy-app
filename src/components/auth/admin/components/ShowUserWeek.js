import React, { useEffect, useState } from 'react';
import { ADMIN_URL } from "../../../../config/user/host-config";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './ShowUserChart.module.scss';
import moment from 'moment';

const ShowUserWeek = () => {
    const [weekUserCount, setWeekUserCount] = useState([]);

    useEffect(() => {
        const getWeekUserCounts = async () => {
            try {
                const response = await fetch(`${ADMIN_URL}/users/count/week`);
                const result = await response.json();

                // 오늘 날짜를 기준으로 각 주의 시작일을 계산하여 포맷
                const formattedData = result.map((count, index) => {
                    const weekStart = moment().subtract(index, 'weeks').startOf('week').format('YYYY [Week] WW');
                    return { week: weekStart, count };
                });

                // 최신 데이터가 오른쪽에 위치하도록 배열을 반전
                setWeekUserCount(formattedData.reverse());
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
                    data={weekUserCount}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
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

export default ShowUserWeek;