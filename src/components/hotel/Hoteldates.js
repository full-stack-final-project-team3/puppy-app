// src/components/hotel/DualDatePickers.js
import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { TextField } from '@mui/material';
import Box from '@mui/material/Box';

export default function DualDatePickers({ startDate, setStartDate, endDate, setEndDate }) {

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <DatePicker
                    views={['day']}
                    label="Arrival"
                    value={startDate}
                    onChange={(newValue) => {
                        setStartDate(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                />
                <DatePicker
                    views={['day']}
                    label="Departure"
                    value={endDate}
                    onChange={(newValue) => {
                        setEndDate(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                />
            </Box>
        </LocalizationProvider>
    );
}