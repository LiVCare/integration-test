import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { DEFAULT_IR_TYPE } from 'src/config';

interface BorrowModalProps {
    show: boolean
    setShow: (status: boolean) => void
    asset: string
    decimals: string
    livManager: any
    provider: any
}

const BorrowModal = ({ show, setShow, asset, decimals, livManager, provider }: BorrowModalProps) => {

    const [state, setState] = useState<string>('init')
    const [waitingTx, setWaitingTx] = useState<boolean>(false)

    const cleanAndClose = () => {
        setState('init')
        setShow(false)
    }

    const sleep = (milliseconds: any) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

    const sendTx = async (event: any) => {
        event.preventDefault();
        const amountForm = (event.target.amount.value);
        const amount = (10 ** Number(decimals)) * Number(amountForm)
        console.log(amount)
        const tx = await livManager.singleAsset.borrow(asset, amount, DEFAULT_IR_TYPE)
        setWaitingTx(true)
        waitTransaction(tx)
    }

    const waitTransaction = async (tx: any) => {
        let transactionReceipt = null
        const expectedBlockTime = 2000;
        while (transactionReceipt == null) {
            transactionReceipt = await provider.getTransactionReceipt(tx.hash);
            await sleep(expectedBlockTime)
        }
        setWaitingTx(false)
        setState('finished')
    }

    return (
        <Modal show={show} onHide={cleanAndClose}>
            <Modal.Header closeButton>
                <Modal.Title>Borrow tokens</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {state == 'finished'
                    ? 'Your tokens have been borrowed!'
                    : <Form onSubmit={sendTx}>
                        {waitingTx ?
                            <></>
                            :
                            <Form.Group className="mb-3" controlId="forminves" >
                                <Form.Label>Amount</Form.Label>
                                <Form.Control type="text" placeholder="Enter amount" name="amount" />
                            </Form.Group>}
                        {waitingTx ? 'Waiting for transaction confirmation....'
                            :
                            <Button variant="primary" type="submit">
                                Borrow
                            </Button>}
                    </Form>}

            </Modal.Body>
        </Modal >
    )
}

export default BorrowModal;
