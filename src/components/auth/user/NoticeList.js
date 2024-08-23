import React, { useRef } from 'react';
import NoticeModal from './NoticeModal';
import styles from './NoticeList.module.scss';
import {NOTICE_URL} from "../../../config/user/host-config";
import {useDispatch, useSelector} from "react-redux";
import {userEditActions} from "../../store/user/UserEditSlice";

const NoticeList = ({ openNotice, noticeList = [], noticeRef, checkNotice, onClose }) => {


    const dispatch = useDispatch();
    const userDetail = useSelector(state => state.userEdit.userDetail);

    const deleteNoticeAll = async () => {
        const response = await fetch(`${NOTICE_URL}/click/all/${userDetail.id}`, {
            method: 'POST',
        });

        if (response.ok) {
            const updatedNotices = noticeList.map(notice => {
                // notice 객체의 복사본을 만들어 isClicked 속성을 추가합니다.
                return {
                    ...notice,
                    isClicked: true
                };
            });

            // 업데이트된 notices 배열을 Redux 상태에 저장합니다.
            dispatch(userEditActions.saveUserNotice(updatedNotices));
            dispatch(
                userEditActions.updateUserDetail({
                    ...userDetail,
                    noticeCount: 0,
                })
            );
        }
    };

    return openNotice && (
        <NoticeModal >
            <div className={styles.noticeWrap} ref={noticeRef}>
                <div className={styles.modalTop}>
                    <div className={styles.dashBoard}>타임 라인</div>
                    <div className={styles.readAll} onClick={deleteNoticeAll}>모두 읽기</div>
                </div>
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