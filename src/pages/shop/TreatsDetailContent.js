import React from 'react';
import Slider from 'react-slick';
import styles from './TreatsDetailContent.module.scss';
import { AUTH_URL } from '../../config/user/host-config';

// 슬라이드 설정
const sliderSettings = {
  infinite: false, // 클론 생성 방지
  slidesToShow: 1,
  slidesToScroll: 1,
  dots: true,
  // 기타 설정...
};

const TreatsDetailContent = ({ treat }) => {
  return (
    <div className={styles.treatDetail}>
      <h2>{treat.title}</h2>
      {treat.weight && <p>무게: {treat.weight}g</p>}

{Array.isArray(treat["treats-pics"]) && treat["treats-pics"].length > 0 && (
  <div className={styles.treatsPics}>
    <Slider {...sliderSettings}>
      {treat["treats-pics"].length === 1 ? (
        <div key={treat["treats-pics"][0].treatsPic}>
          <img
            src={`${AUTH_URL}${treat["treats-pics"][0].treatsPic.replace("/local", "/treats/images")}`}
            alt={treat.title}
            className={styles.treatsImage}
          />
        </div>
      ) : (
        treat["treats-pics"].map((pic) => {
          const treatPicUrl = `${AUTH_URL}${pic.treatsPic.replace(
            "/local",
            "/treats/images"
          )}`;
          return (
            <div key={pic.treatsPic}>
              <img
                src={treatPicUrl}
                alt={treat.title}
                className={styles.treatsImage}
              />
            </div>
          );
        })
      )}
    </Slider>
  </div>
)}


      {/* 추가적인 상세 이미지 표시 */}
      {Array.isArray(treat["treats-detail-pics"]) && treat["treats-detail-pics"].length > 0 && (
        <div className={styles.detailPics}>
          {treat["treats-detail-pics"].map((pic) => {
            const detailPicUrl = `${AUTH_URL}${pic.treatsDetailPic.replace(
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
