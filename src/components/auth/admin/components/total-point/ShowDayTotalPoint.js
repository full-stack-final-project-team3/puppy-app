import React, { useEffect, useState } from 'react';
import { ADMIN_URL } from "../../../../../config/user/host-config";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from '../ShowUserChart.module.scss';
import moment from 'moment';

const ShowDayTotalPoint = () => {
    const [dayTotalPoint, setDayTotalPoint] = useState([]);

    useEffect(() => {
        const fetchDayTotalPoint = async () => {
            try {
                const response = await fetch(`${ADMIN_URL}/expenses/daily`);
                const result = await response.json();

                // 날짜 형식을 MM/DD로 변환
                const formattedData = result.map((count, index) => {
                    const date = moment().subtract(27 - index, 'days').format('MM/DD');
                    return { date, count };
                });

                setDayTotalPoint(formattedData);
            } catch (error) {
                console.error("Failed to fetch daily total points:", error);
            }
        };

        fetchDayTotalPoint();
    }, []);

    return (
        <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={dayTotalPoint}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 10,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis
                        tickFormatter={(value) => `${value.toLocaleString()}`} // 숫자 포맷
                        interval="preserveEnd" // 레이블 간격 조정
                    />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ShowDayTotalPoint;