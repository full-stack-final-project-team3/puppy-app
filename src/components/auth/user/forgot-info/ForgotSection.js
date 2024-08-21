import React, {useState} from 'react';
import styles from './ForgotSection.module.scss';
import ValidEmailAndCode from "./ValidEmailAndCode";
import ModifyPassword from "./ModifyPassword";
import Footer from "../../../../layout/user/Footer";

const ForgotSection = () => {

    const [clearValid, setClearValid] = useState(false)
    const [email, setEmail] = useState('')


    const isClear = (flag) => {
        setClearValid(flag)
    }

    const getEmail = (email) => {
        setEmail(email);
    }

    return (
        <>
            <div className={styles.whole}>
                {!clearValid ?
                    <ValidEmailAndCode isClear={isClear} getEmail={getEmail}/>
                    : <ModifyPassword email={email}/>}
            </div>
            <Footer/>
        </>
    );
};

export default ForgotSection;