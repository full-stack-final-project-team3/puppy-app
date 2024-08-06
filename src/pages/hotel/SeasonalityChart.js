// src/components/SeasonalityChart.js

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserReservations } from '../../components/store/hotel/ReservationSlice';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Dayjs 플러그인 등록
dayjs.extend(utc);
dayjs.extend(timezone);

// Chart.js 스케일 및 요소 등록
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const getMonthlyReservations = (reservations) => {
    const monthlyReservations = {};

    reservations.forEach(({ reservationAt }) => {
        // 여기서 UTC를 로컬 시간대로 변환
        const month = dayjs(reservationAt).utc().local().format('YYYY-MM');

        if (!monthlyReservations[month]) {
            monthlyReservations[month] = 0;
        }

        monthlyReservations[month] += 1;
    });

    return monthlyReservations;
};

const SeasonalityChart = () => {
    const dispatch = useDispatch();
    const { userReservations, status, error } = useSelector(state => state.reservation);
    const userId = JSON.parse(localStorage.getItem('userData')).userId;


    useEffect(() => {
        if (status === 'idle' && userId) {
            dispatch(fetchUserReservations({ userId }));
        }
    }, [status, dispatch, userId]);

    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    if (status === 'failed') {
        return <p>Error: {error}</p>;
    }

    const monthlyReservations = getMonthlyReservations(userReservations);

    const data = {
        labels: Object.keys(monthlyReservations),
        datasets: [
            {
                label: 'Reservations',
                data: Object.values(monthlyReservations),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            title: {
                display: true,
                text: 'Monthly Reservations',
            },
        },
    };

    return (
        <div>
            <h2>Monthly Reservations</h2>
            <Bar data={data} options={options} />
        </div>
    );
};

export default SeasonalityChart;
