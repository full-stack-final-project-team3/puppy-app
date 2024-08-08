import React from 'react';
import styles from './AdminMain.module.scss';
import UserCount from "./UserCount";
import NewUsers from "./NewUsers";
import HotelBookStatus from "./HotelBookStatus";
import ShopStatus from "./ShopStatus";
import UserPointStatus from "./UserPointStatus";
import ReportStatus from "./ReportStatus";

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