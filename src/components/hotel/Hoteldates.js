// src/components/hotel/DualDatePickers.js
import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { TextField, Box } from '@mui/material';
import dayjs from 'dayjs';
// import 'dayjs/locale/ko';

// dayjs.locale('ko');

export default function DualDatePickers({ startDate, setStartDate, endDate, setEndDate }) {

    const today = dayjs();

    // 날짜 포맷팅 함수
    const formatDateRange = (start, end) => {
        const startFormatted = dayjs(start).format('YYYY년 M월 D일');
        const endFormatted = dayjs(end).format('YYYY년 M월 D일');
        return `${startFormatted}부터 ${endFormatted}까지`;
    };

    const handleStartDateChange = (newValue) => {
        if (newValue && dayjs(newValue).isValid()) {
            setStartDate(newValue);
            if (!endDate || dayjs(newValue).isAfter(endDate)) {
                setEndDate(dayjs(newValue).add(1, 'day'));
            }
        } else {
            alert('유효하지 않은 날짜입니다.');
        }
    };

    const handleEndDateChange = (newValue) => {
        if (newValue && dayjs(newValue).isValid()) {
            setEndDate(newValue);
        } else {
            alert('유효하지 않은 날짜입니다.');
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} locale="ko">
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <DatePicker
                    label="Arrival"
                    value={startDate}
                    onChange={handleStartDateChange}
                    renderInput={(params) => (
                        <TextField 
                            {...params} 
                            value={startDate ? dayjs(startDate).format('YYYY년 MM월 DD일') : ''}
                            aria-label="Arrival date"
                        />
                    )}
                    inputFormat="YYYY년 MM월 DD일"
                    minDate={today} // 오늘 날짜 이전은 선택할 수 없습니다
                />
                <DatePicker
                    label="Departure"
                    value={endDate}
                    onChange={handleEndDateChange}
                    renderInput={(params) => (
                        <TextField 
                            {...params} 
                            value={endDate ? dayjs(endDate).format('YYYY년 MM월 DD일') : ''}
                            aria-label="Departure date"
                        />
                    )}
                    inputFormat="YYYY년 MM월 DD일"
                    minDate={startDate || today} // startDate 이후만 선택할 수 있습니다
                />
            </Box>
        </LocalizationProvider>
    );
}
