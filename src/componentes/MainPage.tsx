import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import TableAssets from './TableAssets';
import UserDashboard from './UserDashboard';
import UserProfile from './UserProfile';

interface MainPageProps {
    livManager: any
    provider: any,
    view: string
}

const MainPage = ({ livManager, provider, view }: MainPageProps) => {

    const render = () => {
        switch (view) {
            case 'home':
                return <TableAssets livManager={livManager} provider={provider} />
            case 'dashboard':
                return <UserDashboard livManager={livManager} provider={provider} />
            case 'profile':
                return <UserProfile livManager={livManager} provider={provider} />
            default:
                return <TableAssets livManager={livManager} provider={provider} />;
        }
    }

    return (
        <>
            <div className="main">
                <Container>{render()}</Container>
            </div >
        </>
    )
}

export default MainPage;
