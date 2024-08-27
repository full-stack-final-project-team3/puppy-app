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
import {userDataLoader} from "../../config/user/auth";

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

// 월별 예약 현황을 가져오는 로직
const getMonthlyReservations = (reservations) => {
    const now = dayjs();
    const monthlyReservations = {};

    // 현재 월로부터 미래 11개월까지의 월을 초기화
    for (let i = 0; i < 12; i++) {
        const month = now.add(i, 'month').format('YYYY-MM');
        monthlyReservations[month] = 0;
    }

    reservations.forEach(({ reservationAt }) => {
        const month = dayjs(reservationAt).utc().local().format('YYYY-MM');
        if (monthlyReservations.hasOwnProperty(month)) {
            monthlyReservations[month] += 1;
        }
    });

    return monthlyReservations;
};

// 객실 타입별 예약빈도 수 가져오는 로직
const getTypeBasedReservations = (reservations) => {
    const typeReservations = {
        SMALL_DOG: 0,
        MEDIUM_DOG: 0,
        LARGE_DOG: 0
    };

    reservations.forEach(reservation => {
        const type = reservation.room['room-type'];
        if (type && typeReservations[type] !== undefined) {
            typeReservations[type] += 1;
        }
    });

    return typeReservations;
};

// 그래프를 그려주는 로직
const SeasonalityChart = () => {
    const dispatch = useDispatch();
    const { userReservations, status, error } = useSelector(state => state.reservation);
    const userData = userDataLoader();
    const userId = userData.userId


    useEffect(() => {
        if (status === 'idle' && userId) {
            dispatch(fetchUserReservations({ userId }));
        }
    }, [status, dispatch, userId]);

    if (status === 'loading') {
        return <p>로딩 중...</p>;
    }

    if (status === 'failed') {
        return <p>오류: {error}</p>;
    }

    const monthlyReservations = getMonthlyReservations(userReservations);
    const typeReservations = getTypeBasedReservations(userReservations);

    const monthlyData = {
        labels: Object.keys(monthlyReservations),
        datasets: [
            {
                label: '월별 예약 현황',
                data: Object.values(monthlyReservations),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const typeData = {
        labels: Object.keys(typeReservations),
        datasets: [
            {
                label: '객실 타입별 예약',
                data: Object.values(typeReservations),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
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
                text: '예약 통계'
            },
        },
    };

    return (
        <div>
            <h2>월별 예약 트렌드</h2>
            <Bar data={monthlyData} options={{ ...options, title: { ...options.title, text: '월별 예약 현황' } }} />
            <h2>객실 타입별 예약</h2>
            <Bar data={typeData} options={{ ...options, title: { ...options.title, text: '객실 타입별 예약' } }} />
        </div>
    );
};

export default SeasonalityChart;
