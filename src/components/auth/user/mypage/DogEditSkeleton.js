import React from 'react';
import styles from './DogEditSkeleton.module.scss';

const DogEditSkeleton = () => {
    return (
        <div className={styles.wrap}>
            <div className={styles.header}>
                <div className={`${styles.skeleton} ${styles.logoSkeleton}`}></div>
                <div className={`${styles.skeleton} ${styles.titleSkeleton}`}></div>
            </div>
            <div className={styles.flex}>
                <div className={styles.left}>
                    <div className={styles.row}>
                        <div className={`${styles.skeleton} ${styles.labelSkeleton}`}></div>
                        <div className={`${styles.skeleton} ${styles.answerSkeleton}`}></div>
                    </div>
                    <div className={styles.row}>
                        <div className={`${styles.skeleton} ${styles.labelSkeleton}`}></div>
                        <div className={`${styles.skeleton} ${styles.answerSkeleton}`}></div>
                    </div>
                    <div className={styles.row}>
                        <div className={`${styles.skeleton} ${styles.labelSkeleton}`}></div>
                        <div className={`${styles.skeleton} ${styles.answerSkeleton}`}></div>
                    </div>
                    <div className={styles.row}>
                        <div className={`${styles.skeleton} ${styles.labelSkeleton}`}></div>
                        <div className={`${styles.skeleton} ${styles.inputSkeleton}`}></div>
                    </div>
                    <div className={styles.row}>
                        <div className={`${styles.skeleton} ${styles.labelSkeleton}`}></div>
                        <div className={`${styles.skeleton} ${styles.badgeSkeleton}`}></div>
                    </div>
                    <div className={styles.buttons}>
                        <div className={`${styles.skeleton} ${styles.buttonSkeleton}`}></div>
                        <div className={`${styles.skeleton} ${styles.buttonSkeleton}`}></div>
                    </div>
                </div>
                <div className={styles.right}>
                    <div className={`${styles.skeleton} ${styles.dogProfileSkeleton}`}></div>
                </div>
            </div>
        </div>
    );
};

export default DogEditSkeleton;
