// src/components/hotel/DualDatePickers.js
import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { TextField, Box } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko');

export default function DualDatePickers({ startDate, setStartDate, endDate, setEndDate }) {


    const today = dayjs();

    // 날짜 포맷팅 함수
    const formatDateRange = (start, end) => {
        const startFormatted = dayjs(start).format('M월 D일');
        const endFormatted = dayjs(end).format('M월 D일');
        return `${startFormatted}부터 ${endFormatted}까지`;
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <DatePicker
                    views={['day']}
                    label="Arrival"
                    value={startDate}
                    onChange={(newValue) => {
                        setStartDate(newValue);
                        if (newValue && (!endDate || dayjs(newValue).isAfter(endDate))) {
                            setEndDate(dayjs(newValue).add(1, 'day'));
                        }
                    }}
                    renderInput={(params) => <TextField {...params} />}
                    inputFormat="MM월 DD일"
                    minDate={today} // 오늘 날짜 이전은 선택할 수 없습니다.
                />
                <DatePicker
                    views={['day']}
                    label="Departure"
                    value={endDate}
                    onChange={(newValue) => {
                        setEndDate(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                    inputFormat="MM월 DD일"
                    minDate={startDate || today} // startDate 이후만 선택할 수 있습니다.
                />
            </Box>
            <Box sx={{ marginTop: 2, textAlign: 'center' }}>
                {startDate && endDate && (
                    <div>{formatDateRange(startDate, endDate)}</div>
                )}
            </Box>
        </LocalizationProvider>
    );
}
