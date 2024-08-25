import React, {useEffect, useRef, useState} from 'react';
import styles from './DogEdit.module.scss';
import {useDispatch, useSelector} from "react-redux";
import {userEditActions} from "../../store/user/UserEditSlice";
import {dogEditActions} from "../../store/dog/DogEditSlice";
import {DOG_URL} from "../../../config/user/host-config";
import {useNavigate} from "react-router-dom";
import {decideGender, decideSize, translateAllergy, translateBreed} from './dogUtil.js';
import {LuBadgeX, LuPlusCircle} from "react-icons/lu";
import UserModal from "../user/mypage/UserModal";
import DogEditSkeleton from "../user/mypage/DogEditSkeleton.js";

const DogEdit = () => {
    const [dogProfileUrl, setDogProfileUrl] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalText, setModalText] = useState('');
    const [pendingFunction, setPendingFunction] = useState(null);
    const [isDeleteConfirmation, setIsDeleteConfirmation] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showAllergyDropdown, setShowAllergyDropdown] = useState(false);
    const [selectedAllergies, setSelectedAllergies] = useState([]); // 다중 선택 가능
    const [fileErrorMessage, setFileErrorMessage] = useState(''); // 파일 에러 메시지 상태 추가

    const weightRef = useRef();
    const fileInputRef = useRef();

    const dog = useSelector(state => state.dogEdit.dogInfo);
    const userDetail = useSelector(state => state.userEdit.userDetail);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const allergyOptions = [
        'BEEF', 'CHICKEN', 'CORN', 'DAIRY', 'FISH', 'FLAX', 'LAMB', 'PORK',
        'TURKEY', 'WHEAT', 'SOY', 'RICE', 'PEANUT', 'BARLEY', 'OAT', 'POTATO',
        'TOMATO', 'DUCK', 'SALMON'
    ];

    useEffect(() => {
        window.scrollTo(0, 0);
        const timer = setTimeout(() => {
            setLoading(false);
        }, 850);
        return () => clearTimeout(timer);
    }, []);

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileSizeInMB = file.size / (1024 * 1024);
            if (fileSizeInMB > 3) { // 파일 크기가 3MB 이상인 경우
                setFileErrorMessage(`파일의 용량이 ${fileSizeInMB.toFixed(2)}MB입니다. 3MB 이하로 설정해주세요.`);
                return;
            } else {
                setFileErrorMessage(''); // 에러 메시지 초기화
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setDogProfileUrl(reader.result);
                const updatedDogList = userDetail.dogList.map(d => d.id === dog.id ? {
                    ...d,
                    dogProfileUrl: reader.result
                } : d);
                dispatch(userEditActions.updateUserDetail({...userDetail, dogList: updatedDogList}));
                dispatch(dogEditActions.updateDogInfo({...dog, dogProfileUrl: reader.result}));
            };
            reader.readAsDataURL(file);
        }
    };

    const addAllergy = async () => {
        if (selectedAllergies.length === 0) return;

        const newAllergyList = [...dog.allergies, ...selectedAllergies];
        const updatedDogList = userDetail.dogList.map(d =>
            d.id === dog.id ? {...d, allergies: newAllergyList} : d
        );

        try {
            const response = await fetch(`${DOG_URL}/allergy`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({allergies: selectedAllergies, dogId: dog.id}),
            });

            if (response.ok) {
                dispatch(userEditActions.updateUserDetail({...userDetail, dogList: updatedDogList}));
                dispatch(dogEditActions.updateDogInfo({...dog, allergies: newAllergyList}));
                setModalText("알러지가 추가되었습니다!");
                setPendingFunction(() => {
                });
                setShowModal(true);
            } else {
                console.error('알러지 추가 실패:', response.statusText);
            }
        } catch (error) {
            console.error('알러지 추가 중 에러 발생:', error);
        }

        setShowAllergyDropdown(false);
    };

    const clearEditMode = async () => {
        const weight = weightRef.current.value;
        const payload = {
            weight,
            dogProfileUrl: dogProfileUrl || dog.dogProfileUrl
        };

        const response = await fetch(`${DOG_URL}/${dog.id}`, {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            const updatedDogList = userDetail.dogList.map(d => d.id === dog.id ? {
                ...d,
                weight,
                dogProfileUrl: payload.dogProfileUrl
            } : d);
            dispatch(userEditActions.updateUserDetail({...userDetail, dogList: updatedDogList}));
            dispatch(userEditActions.clearMode());
            dispatch(dogEditActions.clearEdit());
            setModalText("성공적으로 수정이 완료되었습니다.");
            setPendingFunction(() => {
            });
            setShowModal(true);
        } else {
            setModalText("수정에 실패했습니다.");
            setPendingFunction(() => {
            });
            setShowModal(true);
        }
    };

    const removeHandler = async () => {
        try {
            const response = await fetch(`${DOG_URL}/${dog.id}`, {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
            });

            if (response.ok) {
                const updatedDogList = userDetail.dogList.filter(d => d.id !== dog.id);
                dispatch(userEditActions.updateUserDetail({...userDetail, dogList: updatedDogList}));
                dispatch(userEditActions.clearMode());
                dispatch(dogEditActions.clearEdit());
                setModalText("삭제 되었습니다.");
                setPendingFunction(() => navigate("/mypage"));
                setShowModal(true);
            } else {
                setModalText("삭제에 실패했습니다.");
                setShowModal(true);
            }
        } catch (error) {
            console.error('에러 발생:', error);
            setModalText("삭제 중 에러가 발생했습니다.");
            setShowModal(true);
        }
    };

    const removeAllergy = async e => {
        const allergy = e.target.dataset.alg;

        try {
            const response = await fetch(`${DOG_URL}/allergy?allergy=${allergy}&dogId=${dog.id}`, {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
            });

            if (response.ok) {
                const updatedAllergies = dog.allergies.filter(a => a !== allergy);
                const updatedDogList = userDetail.dogList.map(d =>
                    d.id === dog.id ? {...d, allergies: updatedAllergies} : d
                );

                dispatch(userEditActions.updateUserDetail({...userDetail, dogList: updatedDogList}));
                dispatch(dogEditActions.updateDogInfo({...dog, allergies: updatedAllergies}));
                setModalText("알러지가 삭제되었습니다!");
                setPendingFunction(() => {
                });
                setShowModal(true);
            } else {
                console.error('알러지 삭제 실패:', response.statusText);
            }
        } catch (error) {
            console.error('알러지 삭제 중 에러 발생:', error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        clearEditMode()
    };

    const handleConfirmModal = () => {
        setShowModal(false);
        if (isDeleteConfirmation) {
            removeHandler();
        } else {
            if (pendingFunction) {
                pendingFunction();
            }
        }
    };

    if (loading) {
        return (
            <DogEditSkeleton/>
        );
    }

    const handleDeleteClick = () => {
        setModalText("정말 삭제하시겠습니까?");
        setIsDeleteConfirmation(true);
        setShowModal(true);
    };

    const toggleAllergySelection = (allergy) => {
        setSelectedAllergies(prevState =>
            prevState.includes(allergy)
                ? prevState.filter(a => a !== allergy)
                : [...prevState, allergy]
        );
    };

    return (
        <div className={styles.wrap}>
            <div className={styles.header}>
                <img className={styles.img} src="/header-logo.png" alt="Header Logo"/>
                <h2 className={styles.title}>{dog.dogName}의 정보</h2>
            </div>
            <div className={styles.flex}>
                <div className={styles.left}>
                    <div className={styles.row}>
                        <div className={styles.item}>견종</div>
                        <span className={styles.answer}>{translateBreed(dog.dogBreed)}</span>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.item}>생일</div>
                        <span className={styles.answer}>{dog.birthday} <span
                            className={styles.sub}>{dog.age}년 {dog.month}개월</span></span>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.item}>성별</div>
                        <span className={styles.answer}>{decideGender(dog.dogSex)}</span>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.item}>체중</div>
                        <input
                            className={styles.input}
                            type="number"
                            defaultValue={dog.weight}
                            ref={weightRef}
                        />
                        <span className={styles.sub}>{decideSize(dog.dogSize)}</span>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.item}>보유 알러지</div>
                        <div className={styles.answer}>
                            {Array.isArray(dog.allergies) ? dog.allergies.map((allergy, index) => (
                                <span key={index} className={styles.badge}>
                                {translateAllergy(allergy)}
                                    <LuBadgeX className={styles.icon} onClick={removeAllergy} data-alg={allergy}/>
                            </span>
                            )) : <span className={styles.answer}>없음</span>}
                            <LuPlusCircle
                                className={styles.addIcon}
                                onClick={() => setShowAllergyDropdown(!showAllergyDropdown)}
                            />
                            {showAllergyDropdown && (
                                <div className={styles.dropdown}>
                                    {allergyOptions.map((option, index) => (
                                        <div key={index} className={styles.dropdownItem}>
                                            <input
                                                type="checkbox"
                                                id={`allergy-${option}`}
                                                checked={selectedAllergies.includes(option)}
                                                onChange={() => toggleAllergySelection(option)}
                                            />
                                            <label htmlFor={`allergy-${option}`}>{translateAllergy(option)}</label>
                                        </div>
                                    ))}
                                    <button onClick={addAllergy} className={styles.addAllergyButton}>추가</button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={styles.buttons}>
                        <button onClick={handleDeleteClick}>삭제</button>
                        <button onClick={() => {
                            setPendingFunction(() => clearEditMode);
                            setShowModal(true);
                        }}>완료
                        </button>
                    </div>
                </div>
                <div className={styles.right} onClick={handleImageClick}>
                    <div className={`${styles.imgWrap}  ${dog.dogProfileUrl !== null && styles.circle}`}>
                        <img className={styles.dogProfileUrl} src={dog.dogProfileUrl || "header-logo.png"}
                             alt="Dog Profile"/>
                    </div>
                    <div className={styles.hoverText}>강아지 사진 변경</div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{display: 'none'}}
                        onChange={handleFileChange}
                    />
                {fileErrorMessage && (
                    <p className={styles.fileErrorMessage}>
                        {fileErrorMessage}
                    </p>
                )}
                </div>

            </div>

            {showModal && (
                <UserModal
                    title={isDeleteConfirmation ? "삭제 확인" : "성공적으로 수정이 완료되었습니다."}
                    message={modalText}
                    onConfirm={handleConfirmModal}
                    onClose={handleCloseModal}
                    confirmButtonText={isDeleteConfirmation ? "예" : "확인"}
                    showCloseButton={isDeleteConfirmation}
                />
            )}
        </div>
    );
}

export default DogEdit;
