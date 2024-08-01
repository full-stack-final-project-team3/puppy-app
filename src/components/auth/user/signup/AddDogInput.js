import React, { useState, useEffect } from 'react';
import styles from "./SignUpPage.module.scss";
import DogNameInput from "../../dog/DogNameInput";
import DogBreedInput from "../../dog/DogBreedInput";
import DogBirthdayInput from "../../dog/DogBirthdayInput";
import DogSexInput from "../../dog/DogSexInput";
import DogWeightInput from "../../dog/DogWeightInput";
import DogAllergiesInput from "../../dog/DogAllergiesInput";
import {useNavigate} from "react-router-dom";
import { DOG_URL } from '../../../../config/user/host-config';
import {useSelector} from "react-redux";

const AddDogMain = () => {

    const navigate = useNavigate();

    const user = useSelector(state => state.userEdit.userDetail);

    const email = user.email;
    // console.log(email);

    // const [step, setStep] = useState(1);
    
    const [name, setName] = useState('');
    const [breed, setBreed] = useState('');
    const [birthday, setBirthday] = useState(null);
    const [gender, setGender] = useState('');
    const [weight, setWeight] = useState('');
    const [dogSize, setDogSize] = useState('');
    const [allergies, setAllergies] = useState([]);
    // 기본 이미지
    const profileUrl = "https://search.pstatic.net/sunny/?src=https%3A%2F%2Fst2.depositphotos.com%2F5045705%2F11671%2Fv%2F950%2Fdepositphotos_116714982-stock-illustration-little-puppy-icon.jpg&type=a340";

    // useEffect(() => {

    // }, [step]);

    const dogNameValue = (dogName) => {
        setName(dogName);
        // setStep(2);
    };

    const dogBreedValue = (dogBreed) => {
        setBreed(dogBreed);
        // setStep(3);
    };

    const dogBirthdayValue = (date) => {
        const formatDate = date.format('YYYY-MM-DD');
        setBirthday(formatDate);
        // setStep(4);
    };

    const dogSexValue = (sex) => {
        setGender(sex);
        // setStep(5);
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

        // setStep(6);
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

        // console.log(email)

        const response = await fetch(`${DOG_URL}/register/${email}`, {
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
      <>
        <div className={styles.dogInput}>
            <DogNameInput dogNameValue={dogNameValue} />
            <DogBreedInput dogBreedValue={dogBreedValue} />
            <DogBirthdayInput onDateChange={dogBirthdayValue} />
            <DogSexInput dogSexValue={dogSexValue} />
            <DogWeightInput dogWeightValue={dogWeightValue} />
            <DogAllergiesInput onAllergiesChange={dogAllergiesValue} />
        </div>
      </>
    );
};

export default AddDogMain;