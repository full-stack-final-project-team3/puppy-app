import React, { useState, useEffect } from 'react';
import DogNameInput from "./DogNameInput";
import DogBirthdayInput from "./DogBirthdayInput";
import DogBreedInput from "./DogBreedInput";
import styles from "./AddDogMain.module.scss";
import DogRegisterStep from "./DogRegisterStep";
import DogSexInput from "./DogSexInput";

const AddDogMain = () => {

    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [breed, setBreed] = useState('');
    const [birthday, setBirthday] = useState(null);
    const [gender, setGender] = useState('');

    useEffect(() => {
    }, [step]);

    const dogNameValue = (dogName) => {
        setName(dogName);
        setStep(2);
    };

    const dogBreedValue = (dogBreed) => {
        setBreed(dogBreed);
        setStep(3);
    };

    const dogBirthdayValue = (date) => {
        const formatDate = date.format('YYYY-MM-DD');
        setBirthday(formatDate);
        setStep(4);
    };

    const dogSexValue = (sex) => {
        setGender(sex);
        setStep(5)
    }

    return (
        <div className={styles.wrap}>
            {step > 3 && <DogSexInput dogSexValue={dogSexValue}/>}
            {step > 2 && <DogBirthdayInput onDateChange={dogBirthdayValue} />}
            {step > 1 && <DogBreedInput dogBreedValue={dogBreedValue} />}
            <DogNameInput dogNameValue={dogNameValue} />
        </div>
    );
};

export default AddDogMain;