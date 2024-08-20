import React from "react";
import Slider from "react-slick";
import styles from "./TreatsDetailContent.module.scss";
import { AUTH_URL } from "../../config/user/host-config";

const CustomPrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div className={styles.customPrev} onClick={onClick}>
      &#10094; {/* 왼쪽 화살표 아이콘 */}
    </div>
  );
};

const CustomNextArrow = (props) => {
  const { onClick } = props;
  return (
    <div className={styles.customNext} onClick={onClick}>
      &#10095; {/* 오른쪽 화살표 아이콘 */}
    </div>
  );
};

const sliderSettings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true, // 커스텀 화살표를 사용하므로 true로 남겨두기
  prevArrow: <CustomPrevArrow />,
  nextArrow: <CustomNextArrow />,
};

const TreatsDetailContent = ({ treat, toggleTreatSelection }) => {
  return (
    <div className={styles.treatDetail}>
      <div className={styles.contentWrapper}>
        <div className={styles.imageContainer}>
          {Array.isArray(treat["treats-pics"]) &&
            treat["treats-pics"].length > 0 && (
              <Slider {...sliderSettings}>
                {treat["treats-pics"].map((pic) => {
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
                })}
              </Slider>
            )}
        </div>

        <div className={styles.textContent}>
          <h4>{treat.title}</h4>
          {treat.weight && <p>무게: {treat.weight}g</p>}

          {treat.allergieList && treat.allergieList.length > 0 && (
            <p>알레르기 정보: {treat.allergieList.join(", ")}</p>
          )}
          <p>대상 강아지 크기: {treat.dogSize}</p>
          <p>대상 연령대: {treat.treatsAgeType}</p>
          <div className={styles.addBtnContainer}>
            <button className={styles.addBtn} onClick={() => toggleTreatSelection(treat)}>선택하기</button>
          </div>
        </div>
      </div>

      {/* 추가적인 상세 이미지 표시 */}
      {Array.isArray(treat["treats-detail-pics"]) &&
        treat["treats-detail-pics"].length > 0 && (
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
