import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHotelDetails, updateHotel, uploadFile } from '../../components/store/hotel/HotelAddSlice';
import styles from './ModifyHotelPage.module.scss';

const ModifyHotelPage = () => {
    const { hotelId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { hotelData, errorMessage } = useSelector(state => state.hotelAdd);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        businessOwner: '',
        location: '',
        rulesPolicy: '',
        cancelPolicy: '',
        price: '',
        phoneNumber: '',
        hotelImages: [{hotelImgUri: '', type: 'HOTEL'}]
    });

    useEffect(() => {
        if (hotelId) {
            console.log(hotelId)
            dispatch(fetchHotelDetails(hotelId)).then(data => {
                setFormData(prev => ({ ...prev, ...data }));
            });
        }
    }, [dispatch, hotelId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const result = await dispatch(uploadFile(file));
            if (result.type === 'hotel/uploadFile/fulfilled') {
                setFormData(prev => ({
                    ...prev,
                    hotelImages: [...prev.hotelImages, { hotelImgUri: result.payload, type: 'HOTEL' }]
                }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(updateHotel({ hotelId, hotelData: formData }));
        if (result.type === 'hotel/updateHotel/fulfilled') {
            navigate(`/hotel/${hotelId}`);
        }
    };

    return (
        <div className={styles.modifyHotelPage}>
            <h1>호텔 정보 수정</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    호텔 이름:
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
                </label>
                <label>
                    설명:
                    <textarea name="description" value={formData.description} onChange={handleInputChange} />
                </label>
                <label>
                    사업자 정보:
                    <input type="text" name="businessOwner" value={formData.businessOwner} onChange={handleInputChange} />
                </label>
                <label>
                    위치:
                    <input type="text" name="location" value={formData.location} onChange={handleInputChange} />
                </label>
                <label>
                    규칙 및 정책:
                    <textarea name="rulesPolicy" value={formData.rulesPolicy} onChange={handleInputChange} />
                </label>
                <label>
                    취소 정책:
                    <textarea name="cancelPolicy" value={formData.cancelPolicy} onChange={handleInputChange} />
                </label>
                <label>
                    가격:
                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} />
                </label>
                <label>
                    전화번호:
                    <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} />
                </label>
                <label>
                    이미지 추가:
                    <input type="file" onChange={handleImageUpload} />
                </label>
                <button type="submit">저장하기</button>
            </form>
            {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        </div>
    );
};

export default ModifyHotelPage;
