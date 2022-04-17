import {Modal, Button, Form } from 'react-bootstrap';
import cssSignUp from '../../styles/Components/hotelManager.module.css';
import css from '../../styles/Components/modalSignIn.module.css';
import {useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { showModalHotelManager } from '../../redux/reduxSlice/hotelSlice';

export default function Hotelmanager(){
    //import variables------------------------------------------------------------
    const dispatch = useDispatch();

    //initializing component state-------------------------------------------------- 

    //redux state-------------------------------------------------------------------
    const showModal = useSelector(state => state.storeHotel.hotelManagerAccount);
    const stateManager = useSelector(state => state.storeUsers.hotelManagerAcct);

    //Get Hotel Manager Account ID-------------------------------------------------
    let date = new Date();
    let month = date.getMonth()+1 < 10 ?  `0${date.getMonth()+1}` : date.getMonth()+1;
    let accountDate = `HM-${date.getFullYear()}-${month}`;
    let id = 0;
    Object.values(stateManager).forEach(value => {
        let dataId = value['ID'];
        id = parseInt(dataId.split("-")[3]) + 1;
    });
    const accountID = `${accountDate}-${'0000'.substr( String(id).length ) + id}`;
    const referenceNumber = `${date.getFullYear()}-${month}-${'0000'.substr( String(id).length ) + id}`;

    //Form Submit--------------------------------------------------------------------
    const handleSubmit = () => {

    }

    return(
        <Modal show={showModal} onHide={()=> dispatch(showModalHotelManager(false))} animation={true}  centered>
            <Modal.Header closeButton className={css.modalSignInHeader}>
                    <div>
                        <p>Hotel Manager Sign Up</p>
                        <p>Hotel Account Registration</p>
                    </div>
            </Modal.Header>

            <Modal.Body className={cssSignUp.modalCustomerBody}>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className={`${css.customerInput} ${css.conAccountIDCustomer}`}>
                        <Form.Control type="text" disabled value={`ACCOUNT ID:  ${accountID}`} readOnly />
                    </Form.Group>
                </Form>
            </Modal.Body>
        </Modal>
        );
}