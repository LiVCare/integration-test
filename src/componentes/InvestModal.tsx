import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

interface InvestModalProps {
    show: boolean
    setShow: (status: boolean) => void
    asset: string
    decimals: string
    livManager: any
    provider: any
}

const InvestModal = ({ show, setShow, asset, decimals, livManager, provider }: InvestModalProps) => {

    const [state, setState] = useState<string>('approve')
    const [waitingTx, setWaitingTx] = useState<boolean>(false)

    const cleanAndClose = () => {
        setState('approve')
        setShow(false)
    }

    const sleep = (milliseconds: any) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

    const sendTx = async (event: any) => {
        event.preventDefault();
        const amountForm = (event.target.amount.value);
        const amount = (10 ** Number(decimals)) * Number(amountForm)
        let tx = null
        if (state == 'approve') {
            tx = await livManager.singleAsset.approve(asset, amount)
            setState('invest')
        } else {
            tx = await livManager.singleAsset.deposit(asset, amount)
        }
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
        if (state === 'invest') setState('finished')
    }

    return (
        <Modal show={show} onHide={cleanAndClose}>
            <Modal.Header closeButton>
                <Modal.Title>Invest your tokens</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {state == 'finished'
                    ? 'Your tokens have been deposited!'
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
                                {state === 'approve' ? 'Approve' : 'Invest'}
                            </Button>}
                    </Form>}

            </Modal.Body>
        </Modal >
    )
}

export default InvestModal;
