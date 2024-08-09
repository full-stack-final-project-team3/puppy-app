import React from 'react';
import styles from './AdminMain.module.scss';
import UserCount from "./UserCount.js";
import NewUsers from "./NewUsers.js";
import HotelBookStatus from "./HotelBookStatus.js";
import ShopStatus from "./ShopStatus.js";
import UserPointStatus from "./UserPointStatus.js";
import ReportStatus from "./ReportStatus.js";

const AdminMain = ({ visibleComponent }) => {
    const renderComponent = () => {
        switch (visibleComponent) {
            case 'UserCount':
                return <UserCount />;
            case 'NewUsers':
                return <NewUsers />;
            case 'HotelBookStatus':
                return <HotelBookStatus />;
            case 'ShopStatus':
                return <ShopStatus />;
            case 'UserPointStatus':
                return <UserPointStatus />;
            case 'ReportStatus':
                return <ReportStatus />;
            default:
                return <UserCount />;
        }
    };

    return (
        <div className={styles.wrap}>
            {renderComponent()}
        </div>
    );
};

export default AdminMain;