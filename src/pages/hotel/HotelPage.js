import React, {useRef, useEffect} from 'react';
import {useLoaderData} from 'react-router-dom';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import {useDispatch, useSelector} from 'react-redux';
import {
    fetchHotels,
    setStep,
    incrementPersonCount,
    decrementPersonCount,
    resetHotels,
    fetchHotelDetails,
    setTotalPrice,
    setSelectedRoom
} from '../../components/store/hotel/HotelPageSlice';
import StepIndicator from '../../components/hotel/StepIndicator';
import HotelList from '../../components/hotel/HotelList';
import HotelSearchForm from '../../components/hotel/HotelSearchForm';
import RoomDetail from '../../components/hotel/RoomDetail';
import BookingDetail from '../../components/hotel/BookingDetail';
import HotelConfirmation from '../../components/hotel/HotelConfirmation';
import styles from './HotelPage.module.scss';
import './HotelPageAnimations.scss';
import dayjs from 'dayjs';
import Footer from '../../layout/user/Footer';

const HotelPage = () => {
    const userData = useSelector((state) => state.userEdit.userDetail);
    const isAdmin = userData && userData.role === 'ADMIN';

    const dispatch = useDispatch();
    const {
        hotels,
        step,
        loading,
        error,
        personCount,
        selectedHotel,
        selectedRoom,
        totalPrice
    } = useSelector(state => state.hotelPage);
    const startDate = useSelector(state => state.reservation.startDate);
    const endDate = useSelector(state => state.reservation.endDate);
    const user = useSelector(state => state.userEdit.userDetail);

    // console.log("Asdsadsad", user)
    useEffect(() => {
        if (hotels && hotels.length > 0) {
            // console.log('Hotels:', hotels);
        }
    }, [hotels]);

    useEffect(() => {
        // console.log('Selected Hotel:', selectedHotel);
    }, [selectedHotel]);

    useEffect(() => {
        // console.log('Selected Room: ', selectedRoom);
    }, [selectedRoom]);

    const formatDate = (date) => {
        return dayjs(date).format('YYYY / MM / DD ddd');
    };

    const backgroundImages = [
        'url(/hotelmain.png)', // Step 1
        'url(/hotelmain.png)', // Step 2
        'url(/hotelmain.png)', // Step 3
        'url(/hotelmain.png)', // Step 4
        'url(/hotelmain.png)'  // Step 5
    ];

    // 슬라이드 개수에 따라 sliderSettings를 동적으로 설정
    const getSliderSettings = (imageCount) => ({
        dots: true,
        infinite: imageCount > 1,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        cssEase: 'linear'
    });

    const handleSearch = (location) => {
        dispatch(fetchHotels(location));
    };

    const handleNextStep = () => {
        dispatch(setStep(Math.min(step + 1, 5)));
        window.scrollTo(0, 0);
    };

    const handlePreviousStep = () => {
        dispatch(setStep(Math.max(step - 1, 1)));
        window.scrollTo(0, 0);
    };

    const handleStepClick = (num) => {
        if (num < step) {
            dispatch(setStep(num));
            if (num === 1) {
                dispatch(resetHotels());
            }
            window.scrollTo(0, 0);
        }
    };

    const handleShowProperty = (hotelId) => {
        dispatch(fetchHotelDetails(hotelId)).then(() => {
            dispatch(setStep(3));
            window.scrollTo(0, 0);
        });
    };

    const handleBook = (hotel, room) => {
        dispatch(setSelectedRoom(room));
        dispatch(fetchHotelDetails(hotel['hotel-id'])).then(() => {
            dispatch(setStep(4));
            window.scrollTo(0, 0);
        });
    };

    const handlePayment = (hotel, room, totalPrice) => {
        dispatch(setSelectedRoom(room));
        dispatch(setTotalPrice(totalPrice));
        dispatch(fetchHotelDetails(hotel['hotel-id'])).then(() => {
            dispatch(setStep(5));
            window.scrollTo(0, 0);
        });
    };

    const nodeRef1 = useRef(null);
    const nodeRef2 = useRef(null);
    const nodeRef3 = useRef(null);
    const nodeRef4 = useRef(null);
    const nodeRef5 = useRef(null);

    const getNodeRef = (step) => {
        switch (step) {
            case 1: return nodeRef1;
            case 2: return nodeRef2;
            case 3: return nodeRef3;
            case 4: return nodeRef4;
            case 5: return nodeRef5;
            default: return null;
        }
    };


    return (
        <>
        <div
            className={styles.hotelReservationPage}
            style={{backgroundImage: backgroundImages[step - 1]}}
        >
            <StepIndicator step={step} onStepClick={handleStepClick}/>
            <TransitionGroup>
                <CSSTransition
                    key={step}
                    timeout={300}
                    classNames="page"
                    nodeRef={getNodeRef(step)}
                >
                    <div ref={getNodeRef(step)} className={styles.page}>
                        {step === 1 ? (
                            <>
                            <div className={styles.stepContent}>
                                <HotelSearchForm
                                    isAdmin={isAdmin}
                                    personCount={personCount}
                                    incrementPersonCount={() => dispatch(incrementPersonCount())}
                                    decrementPersonCount={() => dispatch(decrementPersonCount())}
                                    handleNextStep={handleNextStep}
                                    onSearch={handleSearch}
                                />
                            </div>
                            <Footer />
                            </>
                        ) : step === 2 ? (
                            <div className={styles.hotelListContainer}>
                                <h1 className={styles.selectedDate}>Selected date</h1>
                                <button
                                    className={styles.dateButton}
                                    onClick={() => handleStepClick(1)}
                                >
                                    {`${formatDate(startDate)} - ${formatDate(endDate)}`}
                                </button>
                                {loading ? (
                                    <p></p>
                                ) : error ? (
                                    <p>Error: {error}</p>
                                ) : (
                                    <HotelList
                                        hotels={hotels}
                                        onShowProperty={handleShowProperty}
                                        getSliderSettings={getSliderSettings} 
                                        />
                                        
                                )}
                            </div>
                        ) : step === 3 ? (
                            <div className={styles.hotelDetailContainer}>
                                <h1 className={styles.selectedDate}>Selected date</h1>
                                <button
                                    className={styles.dateButton}
                                    onClick={() => handleStepClick(2)}
                                >
                                    {`${formatDate(startDate)} - ${formatDate(endDate)}`}
                                </button>
                                {selectedHotel ? (
                                    <RoomDetail
                                        hotel={selectedHotel}
                                        onBook={handleBook}
                                        getSliderSettings={getSliderSettings}
                                    />
                                ) : (
                                    <p></p>
                                )}
                            </div>
                        ) : step === 4 ? (
                            <div className={styles.hotelDetailContainer}>
                                <h1 className={styles.selectedDate}>Selected date</h1>
                                <button
                                    className={styles.dateButton}
                                    onClick={() => handleStepClick(3)}
                                >
                                    {`${formatDate(startDate)} - ${formatDate(endDate)}`}
                                </button>
                                {selectedHotel ? (
                                    <BookingDetail
                                    hotel={selectedHotel}
                                    selectedRoom={selectedRoom}
                                    startDate={startDate}
                                    endDate={endDate}
                                    onPay={handlePayment}
                                />
                                ) : (
                                    <p></p>
                                )}
                                
                            </div>
                            
                        ) : step === 5 ? (
                            <HotelConfirmation
                                hotel={selectedHotel}
                                selectedRoom={selectedRoom}
                                startDate={startDate}
                                endDate={endDate}
                                totalPrice={totalPrice}
                                user={user}
                            />
                        ) : null}
                    </div>
                </CSSTransition>
            </TransitionGroup>
        </div>
            <button className={styles.back} onClick={handlePreviousStep}>&laquo;</button>
        </>
    );
};

export default HotelPage;
