import React, { useEffect, useRef, useState } from "react";
import styles from "./SignUpPage.module.scss";
import { AUTH_URL } from "../../../../config/user/host-config";
import { debounce } from "lodash";

const NickNameInput = () => {
  return (
    <>
      <h1>Step 4</h1>
      <h2>닉네임 입력</h2>
    </>
  );
};

export default NickNameInput;
