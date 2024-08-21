import React, { useEffect, useState } from 'react';
import { ADMIN_URL } from "../../../../config/user/host-config";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './ShowUserChart.module.scss';
import moment from 'moment'; // 날짜 포맷

const ShowUserDay = () => {
    const [dayUserCounts, setDayUserCounts] = useState([]);

    useEffect(() => {
        const getDayUserCounts = async () => {
            try {
                const response = await fetch(`${ADMIN_URL}/users/count/today`);
                const result = await response.json();

                // 오늘 날짜부터 시작하여 각 날짜를 계산
                const formattedData = result.map((count, index) => {
                    const date = moment().subtract(index, 'days').format('MM/DD'); // 날짜 포맷을 MM-DD로 변경
                    return { day: date, count };
                });

                // 최신 데이터가 오른쪽에 위치하도록 배열을 반전
                setDayUserCounts(formattedData.reverse());
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
                    <XAxis
                        dataKey="day"
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

export default ShowUserDay;