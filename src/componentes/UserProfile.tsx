
import React, { useState, useEffect } from 'react';

interface UserProfileProps {
    livManager: any
    provider: any
}

const UserProfile = ({ livManager, provider }: UserProfileProps) => {

    const [heir, setHeir] = useState<any>('')

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
                <h3>Your heir: {heir}</h3>
            </div >
        </>
    )
}

export default UserProfile;
