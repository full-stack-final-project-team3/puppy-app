import React, {useRef, useEffect, useMemo} from 'react';
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

const HotelPage = () => {
    const userData = useLoaderData();
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
    console.log(user);

    useEffect(() => {
        if (hotels && hotels.length > 0) {
            console.log('Hotels:', hotels);
        }
    }, [hotels]);

    useEffect(() => {
        console.log('Selected Hotel:', selectedHotel);
    }, [selectedHotel]);

    useEffect(() => {
        console.log('Selected Room: ', selectedRoom);
    }, [selectedRoom]);

    const formatDate = (date) => {
        return dayjs(date).format('YYYY / MM / DD ddd');
    };

    const backgroundImages = [
        'url(https://www.zooplus.co.uk/magazine/wp-content/uploads/2018/03/dachshund.jpg)', // Step 1
        'url(https://example.com/image2.jpg)', // Step 2
        'url(https://example.com/image3.jpg)', // Step 3
        'url(https://example.com/image4.jpg)', // Step 4
        'url(https://example.com/image5.jpg)'  // Step 5
    ];

    const sliderSettings = useMemo(() => ({
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        cssEase: 'linear'
    }), []);

    const handleSearch = (location) => {
        dispatch(fetchHotels(location));
    };

    const handleNextStep = () => {
        dispatch(setStep(Math.min(step + 1, 5)));
    };

    const handlePreviousStep = () => {
        dispatch(setStep(Math.max(step - 1, 1)));
    };

    const handleStepClick = (num) => {
        if (num < step) {
            dispatch(setStep(num));
            if (num === 1) {
                dispatch(resetHotels());
            }
        }
    };

    const handleShowProperty = (hotelId) => {
        dispatch(fetchHotelDetails(hotelId)).then(() => {
            dispatch(setStep(3));
        });
    };

    const handleBook = (hotel, room) => {
        dispatch(setSelectedRoom(room));
        dispatch(fetchHotelDetails(hotel.id)).then(() => {
            dispatch(setStep(4));
        });
    };

    const handlePayment = (hotel, room, totalPrice) => {
        dispatch(setSelectedRoom(room));
        dispatch(setTotalPrice(totalPrice));
        dispatch(fetchHotelDetails(hotel.id)).then(() => {
            dispatch(setStep(5));
        });
    };

    const nodeRef = useRef(null);

    return (
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
                    nodeRef={nodeRef}
                >
                    <div ref={nodeRef} className={styles.page}>
                        {step === 1 ? (
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
                        ) : step === 2 ? (
                            <div className={styles.hotelListContainer}>
                                <button
                                    className={styles.dateButton}
                                    onClick={() => handleStepClick(1)}
                                >
                                    {`${formatDate(startDate)} - ${formatDate(endDate)}`}
                                </button>
                                {loading ? (
                                    <p>Loading…</p>
                                ) : error ? (
                                    <p>Error: {error}</p>
                                ) : (
                                    <HotelList
                                        hotels={hotels}
                                        onShowProperty={handleShowProperty}/>
                                )}
                                <button onClick={handlePreviousStep}>뒤로가기</button>
                            </div>
                        ) : step === 3 ? (
                            <div className={styles.hotelDetailContainer}>
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
                                        sliderSettings={sliderSettings}
                                    />
                                ) : (
                                    <p>Loading...</p>
                                )}
                            </div>
                        ) : step === 4 ? (
                            <BookingDetail
                                hotel={selectedHotel}
                                selectedRoom={selectedRoom}
                                startDate={startDate}
                                endDate={endDate}
                                onPay={handlePayment}
                            />
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
    );
};

export default HotelPage;
