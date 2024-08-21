import React, {useState} from 'react';
import styles from './ReportStatus.module.scss';
import ReportBoard from "./components/ReportBoard";
import ReportReply from "./components/ReportReply";

const ReportStatus = () => {

    const [showBoard, setShowBoard] = useState(true);
    const [showReply, setShowReply] = useState(false);

    const boardHandler = () => {
        setShowBoard(true);
        setShowReply(false)
    }

    const replyHandler = () => {
        setShowReply(true);
        setShowBoard(false);
    }

    return (
        <div>
            <nav className={styles.nav}>
                <ul className={styles.ul}>
                    <li className={`${styles.menu} ${showBoard && styles.active}`} onClick={boardHandler}>게시글 신고</li>
                    <li className={`${styles.menu} ${showReply && styles.active}`} onClick={replyHandler}>댓글 신고</li>
                </ul>
            </nav>
            {showBoard && <ReportBoard/>}
            {showReply && <ReportReply/>}
        </div>
    );
};

export default ReportStatus;