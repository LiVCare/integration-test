import React, { useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import TableAssets from './TableAssets';
import UserDashboard from './UserDashboard';
import UserProfile from './UserProfile';

interface MainPageProps {
    livManager: any
    provider: any
}

const MainPage = ({ livManager, provider }: MainPageProps) => {

    const [key, setKey] = useState<any>('home');

    return (
        <>
            <div className="footer">
                <Tabs
                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className="mb-3"
                >
                    <Tab eventKey="home" title="Home">
                        <TableAssets livManager={livManager} provider={provider}/>
                    </Tab>
                    <Tab eventKey="dashboard" title="Dashboard">
                        <UserDashboard livManager={livManager} provider={provider}/>
                    </Tab>
                    <Tab eventKey="profile" title="Profile">
                        <UserProfile livManager={livManager} provider={provider}/>
                    </Tab>
                </Tabs>
            </div >
        </>
    )
}

export default MainPage;
