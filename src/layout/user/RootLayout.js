import React from 'react'
import MainNavigation from './MainNavigation'
import {Outlet} from 'react-router-dom'
import Footer from "./Footer";

const RootLayout = () => {

    return (
        <>
            <MainNavigation/>
            {/* RootLayout의 children들이 Outlet으로 렌더링됨 */}
            <main>
                <Outlet/>
            </main>
            <Footer/>
        </>
    )
}

export default RootLayout