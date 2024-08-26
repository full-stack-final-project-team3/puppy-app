import React from "react";
import Footer from "../../layout/user/Footer";
import Home from "../Home";

const WelcomePage = () => {


  return (
      <div>
         {/*{user ? <div className={styles.welcome}>Welcome {userDetail.nickname}~</div> : <div>Welcome ~</div>}*/}
        <Home /> {/* Home 컴포넌트를 렌더링 */}
        <Footer /> {/* Footer 컴포넌트를 렌더링 */}
      </div>
  );
};

export default WelcomePage;
