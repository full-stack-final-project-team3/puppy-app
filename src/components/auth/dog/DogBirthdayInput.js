import React, { useState } from 'react';
import styles from './DogBirthdayInput.module.scss';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';

const DogBirthdayInput = ({ onDateChange }) => {
    const [selectedDate, setSelectedDate] = useState(dayjs());

    const handleDateChange = (date) => {
        setSelectedDate(date);
        if (onDateChange) {
            onDateChange(date);
        }
    };

    return (
        <div className={styles.wrap}>
            <h3 className={styles.h3}>강아지 생일!</h3>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    value={selectedDate}
                    onChange={handleDateChange}
                    maxDate={dayjs()}
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>
        </div>
    );
};

export default DogBirthdayInput;