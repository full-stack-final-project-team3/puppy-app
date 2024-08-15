import React from 'react';
import styles from './UserEditSkeleton.module.scss';

const UserEditSkeleton = () => {
    return (
        <div className={styles.wrap}>
            <div className={`${styles.skeleton} ${styles.titleSkeleton}`}></div>
            <div className={styles.profileContainer}>
                <div className={`${styles.skeleton} ${styles.profileSkeleton}`}></div>
            </div>
            <div className={styles.form}>
                <div className={styles.section}>
                    <div className={`${styles.skeleton} ${styles.inputSkeleton}`}></div>
                </div>
                <div className={styles.doubleSection}>
                    <div className={styles.section}>
                        <div className={`${styles.skeleton} ${styles.inputSkeleton}`}></div>
                    </div>
                    <div className={styles.section}>
                        <div className={`${styles.skeleton} ${styles.inputSkeleton}`}></div>
                    </div>
                </div>
                <div className={styles.doubleSection}>
                    <div className={styles.section}>
                        <div className={`${styles.skeleton} ${styles.inputSkeleton}`}></div>
                    </div>
                    <div className={styles.section}>
                        <div className={`${styles.skeleton} ${styles.inputSkeleton}`}></div>
                    </div>
                </div>
                <div className={styles.section}>
                    <div className={`${styles.skeleton} ${styles.inputSkeleton}`}></div>
                </div>
                <div className={styles.section}>
                    <div className={`${styles.skeleton} ${styles.inputSkeleton}`}></div>
                </div>
                <div className={styles.flex}>
                    <div className={`${styles.skeleton} ${styles.buttonSkeleton}`}></div>
                    <div className={`${styles.skeleton} ${styles.buttonSkeleton}`}></div>
                </div>
            </div>
        </div>
    );
};

export default UserEditSkeleton;
