
import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { DEFAULT_BORROW_ASSET, DEFAULT_BORROW_ASSET_DECIMALS } from 'src/config';
import InvestModal from './InvestModal';
import BorrowModal from './BorrowModal';


interface UserDashboardProps {
    livManager: any
    provider: any
}

const UserDashboard = ({ livManager, provider }: UserDashboardProps) => {

    const [healthFactor, setHealthFactor] = useState<string>('')
    const [deposits, setDeposits] = useState<any>([])
    const [borrows, setBorrows] = useState<any>([])
    const [showInvestModal, setShowInvestModal] = useState<boolean>(false)
    const [showBorrowModal, setShowBorrowModal] = useState<boolean>(false)


    useEffect(() => {
        getUserBalances();
    }, [])


    const getUserBalances = async () => {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        })
        const userData = await livManager.singleAsset.getUserAccountData(
            accounts[0]
        )
        setHealthFactor(userData.healthFactor)
        const tokens = await livManager.singleAsset.getTokenlist()
        const tokensUser = await livManager.singleAsset.getUserReservesData(accounts[0])
        const deposits = tokensUser.filter((token: any) => Number(token.currentATokenBalance) > 0)
        const borrows = tokensUser.filter((token: any) => Number(token.currentVariableDebt) > 0)

        const depositedTokens = deposits.map((deposit: any) => {
            const token = tokens.find((element: any) => element.id == deposit.id)
            return {
                symbol: token.symbol,
                amount: Number(deposit.currentATokenBalance) / 10 ** Number(token.decimals)
            }
        })
        setDeposits(depositedTokens)

        const borrowedTokens = borrows.map((borrow: any) => {
            const token = tokens.find((element: any) => element.id == borrow.id)
            return {
                symbol: token.symbol,
                amount: Number(borrow.currentVariableDebt) / 10 ** Number(token.decimals)
            }
        })
        setDeposits(depositedTokens)
        setBorrows(borrowedTokens)
    }

    return (
        <>
            <div className="dashboard">
                <h1>Your investments</h1>
                <br></br>
                <h3>Your health factor: {healthFactor}</h3>
                <br></br>
                <Button onClick={() => setShowInvestModal(true)}>Repay</Button>
                <Button onClick={() => setShowBorrowModal(true)}>Borrow</Button>
                <h3>Your deposits</h3>
                <Table>
                    <thead>
                        <tr>
                            <th>Symbol</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {deposits.map((reserve: any) =>
                            <tr>
                                <td>{reserve.symbol}</td>
                                <td>{reserve.amount} </td>
                            </tr>)}
                    </tbody>
                </Table>
                <br></br>
                <h3>Your borrows</h3>
                <Table>
                    <thead>
                        <tr>
                            <th>Symbol</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {borrows.map((reserve: any) =>
                            <tr>
                                <td>{reserve.symbol}</td>
                                <td>{reserve.amount} </td>
                            </tr>)}
                    </tbody>
                </Table>
            </div >
            <InvestModal
                show={showInvestModal}
                setShow={setShowInvestModal}
                asset={DEFAULT_BORROW_ASSET}
                decimals={DEFAULT_BORROW_ASSET_DECIMALS}
                livManager={livManager}
                provider={provider}
                type={'repay'}
            />
            <BorrowModal
                show={showBorrowModal}
                setShow={setShowInvestModal}
                asset={DEFAULT_BORROW_ASSET}
                decimals={DEFAULT_BORROW_ASSET_DECIMALS}
                livManager={livManager}
                provider={provider}
            />
        </>
    )
}

export default UserDashboard;
