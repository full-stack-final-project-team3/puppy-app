import React, { useState, useEffect } from 'react';
import DogNameInput from "./DogNameInput";
import DogBirthdayInput from "./DogBirthdayInput";
import DogBreedInput from "./DogBreedInput";
import styles from "./AddDogMain.module.scss";
import DogRegisterStep from "./DogRegisterStep";

const AddDogMain = () => {

    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [breed, setBreed] = useState('');

    useEffect(() => {

    }, [step]);

    const dogNameValue = (dogName) => {
        setName(dogName);
        // console.log("setName 됨!");
        setStep(2);
    }

    const dogBreedValue = (dogBreed) => {
        setBreed(dogBreed)
        setStep(3);
    }



    return (
        <div className={styles.wrap}>
            {/*<DogRegisterStep/>*/}
            {step > 2 && <DogBirthdayInput/>}
            {step > 1 && <DogBreedInput  dogBreedValue={dogBreedValue} />}
            <DogNameInput dogNameValue={dogNameValue} />
        </div>
    );
};

export default AddDogMain;