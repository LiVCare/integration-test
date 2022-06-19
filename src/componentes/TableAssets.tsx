import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import BigNumber from 'bignumber.js'
import InvestModal from './InvestModal';

interface TableAssetsProps {
    livManager: any
    provider: any
}

const TableAssets = ({ livManager, provider }: TableAssetsProps) => {
    const [reserves, setReserves] = useState<any>([])
    const [showInvestModal, setShowInvestModal] = useState<boolean>(false)
    const [asset, setAsset] = useState<string>('')
    const [decimals, setDecimals] = useState<string>('')


    useEffect(() => {
        livManager.singleAsset.getTokenlist().then((reserves: any) => {
            setReserves(reserves)
        })
    }, [])

    const convertUnits = (value: string) => {
        const ray = new BigNumber(10).pow(25)
        return new BigNumber(value).dividedBy(ray).toNumber().toFixed(2)
    }

    const openInvest = (id: string, decimals: string) => {
        setShowInvestModal(true)
        setAsset(id)
        setDecimals(decimals)
    }

    const openBorrow = (id: string, decimals: string) => {}

    return (
        <>
            <div className="footer">
                <Table>
                    <thead>
                        <tr>
                            <th>Symbol</th>
                            <th>Borrow rate</th>
                            <th>Liquidity rate</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {reserves.map((reserve: any) =>
                            <tr>
                                <td>{reserve.symbol}</td>
                                <td>{convertUnits(reserve.currentVariableBorrowRate)} % </td>
                                <td>{convertUnits(reserve.currentLiquidityRate)} %</td>
                                <td><Button onClick={() => openInvest(reserve.id, reserve.decimals)}>Invest</Button></td>
                                <td><Button onClick={() => openBorrow(reserve.id, reserve.decimals)}>Borrow</Button></td>
                            </tr>)}
                    </tbody>
                </Table>
            </div >
            <InvestModal
                show={showInvestModal}
                setShow={setShowInvestModal}
                asset={asset}
                decimals={decimals}
                livManager={livManager}
                provider={provider}
            />
        </>
    )
}

export default TableAssets;
