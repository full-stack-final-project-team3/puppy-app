import React, { useState, useEffect } from 'react';
import DogNameInput from "./DogNameInput";
import DogBirthdayInput from "./DogBirthdayInput";
import DogBreedInput from "./DogBreedInput";
import styles from "./AddDogMain.module.scss";
import DogSexInput from "./DogSexInput";
import DogWeightInput from "./DogWeightInput";
import DogAllergiesInput from "./DogAllergiesInput";

const AddDogMain = () => {

    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [breed, setBreed] = useState('');
    const [birthday, setBirthday] = useState(null);
    const [gender, setGender] = useState('');
    const [weight, setWeight] = useState('');
    const [allergies, setAllergies] = useState([]);

    useEffect(() => {
        console.log("Current step:", step);
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
        setStep(5);
    }

    const dogWeightValue = (weight) => {
        setWeight(weight);
        setStep(6);
    }

    const dogAllergiesValue = (allergies) => {
        setAllergies(allergies);
    }



    return (
        <div className={styles.wrap}>
            {step > 5 && <DogAllergiesInput onAllergiesChange={dogAllergiesValue}  />}
            {step > 4 && <DogWeightInput dogWeightValue={dogWeightValue}/>}
            {step > 3 && <DogSexInput dogSexValue={dogSexValue}/>}
            {step > 2 && <DogBirthdayInput onDateChange={dogBirthdayValue} />}
            {step > 1 && <DogBreedInput dogBreedValue={dogBreedValue} />}
            <DogNameInput dogNameValue={dogNameValue} />
        </div>
    );
};

export default AddDogMain;