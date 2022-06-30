
import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import UpdateHeirModal from './UpdateHeirModal';

interface UserProfileProps {
    livManager: any
    provider: any
}

const UserProfile = ({ livManager, provider }: UserProfileProps) => {

    const [heir, setHeir] = useState<string>('')
    const [showHierModal, setshowHierModal] = useState<boolean>(false)

    useEffect(() => {
        getData();
    }, [])


    const getData = async () => {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        })
        const heir = await livManager.singleAsset.getBeneficiary(
            accounts[0]
        )

        setHeir(heir)

    }

    return (
        <>
            <div className="footer">
                <h1>Your profile</h1>
                <br></br>
                <h3>Your heir: {`${heir.substring(0, 5)}...${heir.substring(36)}`}</h3>
                <Button onClick={() => setshowHierModal(true)}>Update Heir</Button>
            </div >
            <UpdateHeirModal
                livManager={livManager}
                provider={provider}
                show={showHierModal}
                setShow={setshowHierModal}
            />
        </>
    )
}

export default UserProfile;
