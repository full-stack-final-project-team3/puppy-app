import React, {useState} from 'react';
import styles from './ForgotSection.module.scss';
import ValidEmailAndCode from "./ValidEmailAndCode";
import ModifyPassword from "./ModifyPassword";

const ForgotSection = () => {

    const [clearValid, setClearValid] = useState(false)

    const isClear = (flag) => {
        console.log(flag)
        setClearValid(flag)
    }

    return (
        <div className={styles.whole}>
            { !clearValid ?
                <ValidEmailAndCode isClear={isClear}/>
                : <ModifyPassword/>}
        </div>
    );
};

export default ForgotSection;