import React from 'react';
import DogNameInput from "./DogNameInput";
import DogBirthdayInput from "./DogBirthdayInput";
import DogBreedInput from "./DogBreedInput";
import styles from "./AddDogMain.module.scss";

const AddDogMain = () => {
    return (
        <div className={styles.wrap}>

            <DogNameInput/>
            <DogBreedInput/>
            <DogBirthdayInput/>
        </div>
    );
};

export default AddDogMain;