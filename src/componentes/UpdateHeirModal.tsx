import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { DEFAULT_IR_TYPE } from 'src/config';

interface UpdateHeirModalProps {
    show: boolean
    setShow: (status: boolean) => void
    livManager: any
    provider: any
}

const UpdateHeirModal = ({ show, setShow, livManager, provider }: UpdateHeirModalProps) => {

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
        const newHeir = (event.target.heir.value);
        const tx = await livManager.singleAsset.setBeneficiary(newHeir)
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
                <Modal.Title>Invest your tokens</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {state == 'finished'
                    ? 'Your heir  have been updated!'
                    : <Form onSubmit={sendTx}>
                        {waitingTx ?
                            <></>
                            :
                            <Form.Group className="mb-3" controlId="forminves" >
                                <Form.Label>Address</Form.Label>
                                <Form.Control type="text" placeholder="Enter new Heir" name="heir" />
                            </Form.Group>}
                        {waitingTx ? 'Waiting for transaction confirmation....'
                            :
                            <Button variant="primary" type="submit">
                                Update
                            </Button>}
                    </Form>}

            </Modal.Body>
        </Modal >
    )
}

export default UpdateHeirModal;
