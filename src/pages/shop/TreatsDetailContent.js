import React from 'react';
import styles from './TreatsDetailContent.module.scss'; 

const TreatsDetailContent = ({ treat }) => {
  return (
    <div className={styles.treatDetail}>
      <h2>{treat.title}</h2>
      {treat.weight && <p>무게: {treat.weight}g</p>}
      
      {/* 간식 이미지 표시 */}
      {Array.isArray(treat["treats-pics"]) && treat["treats-pics"].length > 0 && (
        <div className={styles.treatsPics}>
          {treat["treats-pics"].map((pic) => {
            const treatPicUrl = `http://localhost:8888${pic.treatsPic.replace(
              "/local",
              "/treats/images"
            )}`;
            return (
              <img
                key={pic.treatsPic}
                src={treatPicUrl}
                alt={treat.title}
                className={styles.treatsImage}
              />
            );
          })}
        </div>
      )}

      {/* 추가적인 상세 이미지 표시 */}
      {Array.isArray(treat["treats-detail-pics"]) && treat["treats-detail-pics"].length > 0 && (
        <div className={styles.detailPics}>
          {treat["treats-detail-pics"].map((pic) => {
            const detailPicUrl = `http://localhost:8888${pic.treatsDetailPic.replace(
              "/local",
              "/treats/images"
            )}`;
            return (
              <img
                key={pic.id}
                src={detailPicUrl}
                alt={treat.title}
                className={styles.detailImage}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TreatsDetailContent;
