import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchHotelDetails, updateHotel, uploadFile } from '../../components/store/hotel/HotelAddSlice';
import styles from "../../components/hotel/HotelList.module.scss";
import formStyles from "./ModifyHotelPage.module.scss";
import {AUTH_URL} from '../../config/user/host-config'


function ModifyHotelPage() {
    const { hotelId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const hotel = useSelector(state => state.hotelPage.hotels.find(h => h.id === hotelId) || {});

    const [hotelData, setHotelData] = useState({
        name: '',
        description: '',
        businessOwner: '',
        location: '',
        rulesPolicy: '',
        cancelPolicy: '',
        phoneNumber: '',
        hotelImages: [] // 초기값을 빈 배열로 설정
    });

    useEffect(() => {
        if (!hotel || Object.keys(hotel).length === 0) {
            dispatch(fetchHotelDetails(hotelId));
        } else {
            setHotelData({
                ...hotel,
                hotelImages: hotel["hotel-images"] || [] // hotelImages가 undefined일 경우 빈 배열 사용
            });
        }
    }, [dispatch, hotelId, hotel]);

    const handleChange = (e) => {
        if (e.target.name === 'hotelImages') {
            const files = Array.from(e.target.files);
            files.forEach(file => {
                dispatch(uploadFile(file)).then(response => {
                    setHotelData(prevState => ({
                        ...prevState,
                        hotelImages: [...prevState.hotelImages, {
                            hotelImgUri: response.payload,
                            type: 'HOTEL'
                        }]
                    }));
                });
            });
        } else {
            setHotelData({
                ...hotelData,
                [e.target.name]: e.target.value
            });
        }
    };

    const handleDeleteImage = (index) => {
        setHotelData({
            ...hotelData,
            hotelImages: hotelData.hotelImages.filter((_, imgIndex) => imgIndex !== index)
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateHotel({ hotelId, hotelData }))
            .unwrap()
            .then(() => {
                alert('호텔 수정 성공');
                navigate('/hotel');
            })
            .catch((error) => {
                console.error("업데이트 실패:", error);
                alert('호텔 수정 실패: ' + error.message);
            });
    };

    return (
        <div className={formStyles.modifyHotelPage}>
            <h1>Modify Hotel</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        required
                        value={hotelData.name}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        name="description"
                        required
                        value={hotelData.description}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Business Owner:</label>
                    <input
                        type="text"
                        name="businessOwner"
                        value={hotelData.businessOwner}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Location:</label>
                    <input
                        type="text"
                        name="location"
                        required
                        value={hotelData.location}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Rules Policy:</label>
                    <textarea
                        type="text"
                        name="rulesPolicy"
                        value={hotelData.rulesPolicy}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Cancel Policy:</label>
                    <textarea
                        type="text"
                        name="cancelPolicy"
                        value={hotelData.cancelPolicy}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Phone Number:</label>
                    <input
                        type="text"
                        name="phoneNumber"
                        value={hotelData.phoneNumber}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Hotel Images:</label>
                    <input type="file" name="hotelImages" multiple onChange={handleChange} />
                    <div className={styles.imageGallery}>
                        {hotelData.hotelImages.map((image, index) => {
                            const imageUrl = image.type === 'LOCAL'
                                ? image.hotelImgUri
                                : `${AUTH_URL}${image.hotelImgUri.replace('/local', '/hotel/images')}`;
                            return (
                                <div key={index} className={styles.imageContainer}>
                                    <img
                                        src={imageUrl}
                                        alt={`${hotelData.name} 이미지`}
                                        style={{maxWidth: '150px', maxHeight: '150px', width: 'auto', height: 'auto'}}
                                    />
                                    <button type="button" onClick={() => handleDeleteImage(index)}>
                                        Delete
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
}

export default ModifyHotelPage;