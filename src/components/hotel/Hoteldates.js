import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { TextField, Box } from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'; // 이 플러그인을 추가
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';   // 이 플러그인을 추가

// 필요한 플러그인 확장
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export default function DualDatePickers({ startDate, setStartDate, endDate, setEndDate }) {

    const today = dayjs();

    const handleStartDateChange = (newValue) => {
        if (newValue && dayjs(newValue).isValid()) {
            const nextDay = dayjs(newValue).add(1, 'day');
            setStartDate(newValue);
            // End date must be at least one day after start date
            if (!endDate || dayjs(newValue).isSameOrAfter(endDate)) {
                setEndDate(nextDay);
            }
        } else {
            alert('유효하지 않은 날짜입니다.');
        }
    };

    const handleEndDateChange = (newValue) => {
        if (newValue && dayjs(newValue).isValid()) {
            // Prevent setting the end date to the same day as the start date
            if (dayjs(newValue).isSameOrBefore(startDate)) {
                alert('출발일은 도착일 이후여야 합니다.');
            } else {
                setEndDate(newValue);
            }
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
                    inputFormat="YYYY년 MM월 DD일"
                    minDate={today} // 오늘 날짜 이전은 선택할 수 없습니다
                    components={{
                        TextField: ({ inputRef, inputProps, InputProps }) => (
                            <TextField
                                ref={inputRef}
                                {...inputProps}
                                InputProps={{ ...InputProps }}
                                label="Arrival"
                                value={startDate ? dayjs(startDate).format('YYYY년 MM월 DD일') : ''}
                                aria-label="Arrival date"
                            />
                        )
                    }}
                />
                <DatePicker
                    label="Departure"
                    value={endDate}
                    onChange={handleEndDateChange}
                    inputFormat="YYYY년 MM월 DD일"
                    minDate={dayjs(startDate).add(1, 'day') || today} // startDate 이후만 선택할 수 있습니다
                    components={{
                        TextField: ({ inputRef, inputProps, InputProps }) => (
                            <TextField
                                ref={inputRef}
                                {...inputProps}
                                InputProps={{ ...InputProps }}
                                label="Departure"
                                value={endDate ? dayjs(endDate).format('YYYY년 MM월 DD일') : ''}
                                aria-label="Departure date"
                            />
                        )
                    }}
                />
            </Box>
        </LocalizationProvider>
    );
}
