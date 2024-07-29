import React, { useState, useEffect } from 'react';
import DogNameInput from "./DogNameInput";
import DogBirthdayInput from "./DogBirthdayInput";
import DogBreedInput from "./DogBreedInput";
import styles from "./AddDogMain.module.scss";
import DogSexInput from "./DogSexInput";
import DogWeightInput from "./DogWeightInput";
import DogAllergiesInput from "./DogAllergiesInput";
import {useNavigate, useRouteLoaderData} from "react-router-dom";
import {DOG_URL} from "../../../config/user/host-config";

const AddDogMain = () => {

    const navigate = useNavigate();

    const userData2 = useRouteLoaderData('user-data2');
    const userData = useRouteLoaderData('user-data');

    console.log(userData2)
    console.log(userData)


    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [breed, setBreed] = useState('');
    const [birthday, setBirthday] = useState(null);
    const [gender, setGender] = useState('');
    const [weight, setWeight] = useState('');
    const [dogSize, setDogSize] = useState('');
    const [allergies, setAllergies] = useState([]);
    // 기본 이미지
    const profileUrl = "https://search.pstatic.net/sunny/?src=https%3A%2F%2Fst2.depositphotos.com%2F5045705%2F11671%2Fv%2F950%2Fdepositphotos_116714982-stock-illustration-little-puppy-icon.jpg&type=a340";

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
        setStep(5);
    }

    const dogWeightValue = (weight) => {
        setWeight(weight);

        if (weight > 25) {
            setDogSize("LARGE")
        } else if (weight > 10) {
            setDogSize("MEDIUM")
        } else {
            setDogSize("SMALL")
        }

        setStep(6);
    }

    const dogAllergiesValue = async (allergies) => {

        setAllergies(allergies);

        const payload = {
            "dogName": name,
            "dogBreed": breed,
            "birthday": birthday,
            "dogSex": gender,
            "dogSize": dogSize,
            "weight": weight,
            "allergies": allergies,
            "dogProfileUrl": profileUrl,
        }
        console.log(payload)
        console.log(userData)

        const response = await fetch(`${DOG_URL}/register/${userData.email}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.text();

        if (result) {
            alert('강아지 등록 성공!');
            navigate('/mypage')
        }
    }


    return (
        <div className={styles.wrap}>
            {step === 1 && <DogNameInput dogNameValue={dogNameValue}/>}
            {step === 2 && <DogBreedInput dogBreedValue={dogBreedValue} />}
            {step === 3 && <DogBirthdayInput onDateChange={dogBirthdayValue} />}
            {step === 4 && <DogSexInput dogSexValue={dogSexValue}/>}
            {step === 5 && <DogWeightInput dogWeightValue={dogWeightValue}/>}
            {step === 6 && <DogAllergiesInput onAllergiesChange={dogAllergiesValue}  />}
        </div>
    );
};

export default AddDogMain;