import React from 'react'
import { Header, Footer, MetaMessenger, FanpageScript } from '.'

const Layout = ({ children }) => {
    return (
        <>
            <Header />
            { children }
            <MetaMessenger />
            <Footer />
        </>
    )
}

export default Layout