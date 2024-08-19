import React, { useRef } from 'react';
import NoticeModal from './NoticeModal';
import styles from './NoticeList.module.scss';

const NoticeList = ({ openNotice, noticeList, noticeRef, checkNotice, onClose }) => {
    return openNotice && (
        <NoticeModal >
            <div className={styles.noticeWrap} ref={noticeRef}>
                {noticeList.length > 0 ? (
                    noticeList
                        .slice()
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .map((notice) => (
                            <React.Fragment key={notice.id}>
                                <div
                                    className={`${styles.message} ${
                                        notice.clicked ? styles.clickedMessage : ""
                                    }`}
                                    onClick={
                                        !notice.clicked ? () => checkNotice(notice.id) : undefined
                                    }
                                >
                                    {notice.message}
                                </div>
                                <div className={styles.time}>
                                    {new Date(
                                        (notice.createdAt || "").replace(" ", "T")
                                    ).toLocaleString()}
                                </div>
                            </React.Fragment>
                        ))
                ) : (
                    <div className={styles.nothingNotice}>알림이 없습니다.</div>
                )}
            </div>
        </NoticeModal>
    );
};

export default NoticeList;