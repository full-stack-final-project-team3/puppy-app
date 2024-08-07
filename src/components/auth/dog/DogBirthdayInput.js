import React, { useState } from 'react';
import styles from './DogBirthdayInput.module.scss';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from "date-fns/locale";
import dayjs from 'dayjs';

const DogBirthdayInput = ({ onDateChange }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleDateChange = (date) => {
        setSelectedDate(date);
        if (onDateChange) {
            onDateChange(dayjs(date));
        }
    };

    return (
        <div className={styles.wrap}>
            <h3 className={styles.h3}>강아지 생일!</h3>
            <DatePicker
                locale={ko}    // 언어설정 기본값은 영어
                dateFormat="yyyy-MM-dd"    // 날짜 형식 설정
                className={styles['input-datepicker']}    // 클래스 명 지정 css주기 위해
                maxDate={new Date()}    // 선택할 수 있는 최대 날짜값 지정
                selected={selectedDate}    // 선택된 날짜
                onChange={handleDateChange}    // 날짜를 선택하였을 때 실행될 함수
                placeholderText="강아지 생일!"    // placeholder
                closeOnScroll={true}    // 스크롤을 움직였을 때 자동으로 닫히도록 설정 기본값 false
                showYearDropdown    // 연도 드롭다운 표시
                scrollableYearDropdown    // 스크롤 가능한 연도 드롭다운
                yearDropdownItemNumber={15}    // 드롭다운에 표시할 연도 수
            />
        </div>
    );
};

export default DogBirthdayInput;