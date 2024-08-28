import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllReservations } from '../../components/store/hotel/ReservationSlice';
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
import { getUserToken } from "../../config/user/auth";
import { ROOM_URL } from "../../config/user/host-config";

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

// Room details fetching function
const fetchRoomDetails = async (roomId) => {
    const token = getUserToken();
    const response = await fetch(`${ROOM_URL}/${roomId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch room details');
    }

    return response.json();
};

// Function to get type-based reservations
const getTypeBasedReservations = async (reservations) => {
    const typeReservations = {
        SMALL_DOG: 0,
        MEDIUM_DOG: 0,
        LARGE_DOG: 0
    };

    for (const reservation of reservations) {
        let updatedReservation = { ...reservation }; // 기존 reservation 객체를 복사하여 새로운 객체 생성
        if (!updatedReservation.room) {
            const roomDetails = await fetchRoomDetails(updatedReservation.roomId);
            updatedReservation = { ...updatedReservation, room: roomDetails }; // 새로운 room 속성을 추가한 새로운 객체 생성
        }

        const roomType = updatedReservation.room && updatedReservation.room['room-type'];
        if (roomType && typeReservations[roomType] !== undefined) {
            typeReservations[roomType] += 1;
        }
    }

    return typeReservations;
};


// Function to get monthly reservations
const getMonthlyReservations = (reservations) => {
    const now = dayjs();
    const monthlyReservations = {};

    // Initialize the next 12 months
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

// Main component to render charts
const SeasonalityChart = () => {
    const dispatch = useDispatch();
    const { allReservations, status, error } = useSelector(state => state.reservation);
    const [typeReservations, setTypeReservations] = useState(null);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchAllReservations());
        }
    }, [status, dispatch]);

    useEffect(() => {
        const fetchTypeReservations = async () => {
            if (allReservations.length > 0) {
                const types = await getTypeBasedReservations(allReservations);
                setTypeReservations(types);
            }
        };
        fetchTypeReservations();
    }, [allReservations]);

    if (status === 'loading') {
        return <p>로딩 중...</p>;
    }

    if (status === 'failed') {
        return <p>오류: {error}</p>;
    }

    const monthlyReservations = getMonthlyReservations(allReservations);

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

    const typeData = typeReservations ? {
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
    } : null;

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
            {typeData && (
                <>
                    <h2>객실 타입별 예약</h2>
                    <Bar data={typeData} options={{ ...options, title: { ...options.title, text: '객실 타입별 예약' } }} />
                </>
            )}
        </div>
    );
};

export default SeasonalityChart;
