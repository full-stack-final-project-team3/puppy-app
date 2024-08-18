import React from 'react';
import styles from '../ReportStatus.module.scss';

const ReportReply = () => {
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>신고된 댓글 목록</h2>
            <table className={styles.reportTable}>
                <thead>
                <tr>
                    <th>신고자</th>
                    <th>신고받은 유저</th>
                    <th>사유</th>
                    <th>댓글 보기</th>
                </tr>
                </thead>
                <tbody>
                {/* 이 부분을 map 함수로 대체 */}
                <tr>
                    <td>user1</td>
                    <td>swings</td>
                    <td>사유1</td>
                    <td>
                        <button className={styles.viewButton}>보기</button>
                    </td>
                </tr>
                <tr>
                    <td>user2</td>
                    <td>swings</td>
                    <td>사유2</td>
                    <td>
                        <button className={styles.viewButton}>보기</button>
                    </td>
                </tr>
                <tr>
                    <td>user3</td>
                    <td>swings</td>
                    <td>사유3</td>
                    <td>
                        <button className={styles.viewButton}>보기</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ReportReply;