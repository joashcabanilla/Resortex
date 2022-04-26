import {Modal, Button, Form } from 'react-bootstrap';
import cssSignUp from '../../styles/Components/hotelManager.module.css';
import css from '../../styles/Components/modalSignIn.module.css';
import {useState, useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { showModalHotelManager } from '../../redux/reduxSlice/hotelSlice';

export default function Hotelmanager(){
    //import variables------------------------------------------------------------
    const dispatch = useDispatch();

    //initializing component state---------------------------------------------------
    const errorObject = {
        isValid: false,
        isInvalid: false,
        error:"",
    };
    const [formError, setFormError] = useState({
        firstname:{
            ...errorObject,
        },
        middlename:{
            ...errorObject,
        },
        lastname:{
            ...errorObject,
        },
        username:{
            ...errorObject,
        },
        password:{
            ...errorObject,
        },
        confirmpassword:{
            ...errorObject,
        },
        hotelcover:{
            ...errorObject,  
        },
        hotelDescription:{
            ...errorObject,  
        },
        hotelLocation:{
            ...errorObject,  
        },
        hotelName:{
            ...errorObject,  
        },
    });
    const [hotelCover, setHotelCover] = useState("");

    //react Hooks useRef--------------------------------------------------------------
    const refFirstname = useRef();
    const refMiddlename = useRef();
    const refLastname = useRef();
    const refUsername = useRef();
    const refPassword = useRef();
    const refConfirmpassword = useRef();
    const refHotelcover = useRef();
    const refHotelDescription = useRef();
    const refHotelLocation = useRef();
    const refHotelName = useRef();
    const refSubmit = useRef();
    
    //redux state-------------------------------------------------------------------
    const showModal = useSelector(state => state.storeHotel.hotelManagerAccount);
    const stateManager = useSelector(state => state.storeUsers.hotelManagerAcct);

    //Get Hotel Manager Account ID-------------------------------------------------
    let date = new Date();
    let month = date.getMonth()+1 < 10 ?  `0${date.getMonth()+1}` : date.getMonth()+1;
    let accountDate = `${date.getFullYear()}-${month}`;
    let id = 0;
    Object.values(stateManager).forEach(value => {
        let dataId = value['ID'];
        id = parseInt(dataId.split("-")[2]) + 1;
    });
    const accountID = `${accountDate}-${'0000'.substr( String(id).length ) + id}`;

    //Update Form Error State Function-----------------------------------------------
    const updateFormError = (error, invalid, valid, input) => {
        setFormError(formError => ({
            ...formError,
            [input]:{
                isValid: valid,
                isInvalid: invalid,
                error: error,
            }
        }));
    }

    //Form Onchange Event------------------------------------------------------------
    const formOnchange = (input) => {
        switch(input){
            case "firstname":
                let firstname = refFirstname.current.value;
                firstname == "" ? updateFormError("",false,false,"firstname") : updateFormError("",false,true,"firstname");
            break;

            case "middlename":
                let middlename = refMiddlename.current.value;
                middlename == "" ? updateFormError("",false,false,"middlename") : updateFormError("",false,true,"middlename"); 
            break;

            case "lastname":
                let lastname = refLastname.current.value;
                lastname == "" ? updateFormError("",false,false,"lastname") : updateFormError("",false,true,"lastname");
            break;

            case "username":
                let username = refUsername.current.value;
                username == "" ? updateFormError("",false,false,"username") : updateFormError("",false,true,"username");
            break;

            case "password":
                let password = refPassword.current.value;
                password == "" ? updateFormError("",false,false,"password") : updateFormError("",false,true,"password");
            break;

            case "confirmpassword":
                let confirmpassword = refConfirmpassword.current.value;
                confirmpassword == "" ? updateFormError("",false,false,"confirmpassword") : updateFormError("",false,true,"confirmpassword");
            break;

            case "hotelcover":
                let hotelcover = refHotelcover.current.value;
                hotelcover != "" ? setHotelCover(URL.createObjectURL(refHotelcover.current.files[0])) : setHotelCover("");
                hotelcover != "" ? updateFormError("",false,true,"hotelcover") : updateFormError("",false,false,"hotelcover");
            break;

            case "hotelDescription":
                let hotelDescription = refHotelDescription.current.value;
                hotelDescription == "" ? updateFormError("",false,false,"hotelDescription") : updateFormError("",false,true,"hotelDescription");
            break;

            case "hotelLocation":
                let hotelLocation = refHotelLocation.current.value;
                hotelLocation == "" ? updateFormError("",false,false,"hotelLocation") : updateFormError("",false,true,"hotelLocation");
            break;

            case "hotelName":
                let hotelName = refHotelName.current.value;
                hotelName == "" ? updateFormError("",false,false,"hotelName") : updateFormError("",false,true,"hotelName");
            break;
        }
    }

    //Modal Hide function------------------------------------------------------------
    const hideModalForm = () => {
        setHotelCover("");
        dispatch(showModalHotelManager(false));
        setFormError({
            firstname:{
                ...errorObject,
            },
            middlename:{
                ...errorObject,
            },
            lastname:{
                ...errorObject,
            },
            username:{
                ...errorObject,
            },
            password:{
                ...errorObject,
            },
            confirmpassword:{
                ...errorObject,
            },
            hotelcover:{
                ...errorObject,  
            },
            hotelDescription:{
                ...errorObject,  
            },
            hotelLocation:{
                ...errorObject,  
            },
            hotelName:{
                ...errorObject,  
            }
        });
    }
    
    //Set Hotel Cover Image Component------------------------------------------------
    const hotelCoverComponent = () => {
        return hotelCover != "" ? (
             <div className={`${cssSignUp.conHotelCoverImage} ${css.profileIcon}`}>
                 <img src={hotelCover} alt="Hotel Cover Picture" />
             </div>
         ) : (
        <div className={`${cssSignUp.conHotelCover} ${css.profileIcon}`}>
             <img src='/image/image_icon.png' alt="Hotel Cover Picture" />
         </div>
        ); 
     }
    
    //Form Key Down Event------------------------------------------------------------
    const descriptionKeyDown = (e) => {
        if(e.key == "Enter")  refSubmit.current.focus();
    }

    const locationKeyDown = (e) => {
        if(e.key == "Enter") refSubmit.current.focus();
    }

    //Form Submit--------------------------------------------------------------------
    const handleSubmit = (e) => {
        e.preventDefault();
        let firstname = refFirstname.current.value;
        let middlename = refMiddlename.current.value;
        let lastname = refLastname.current.value;
        let username = refUsername.current.value;
        let password = refPassword.current.value;
        let confirmpassword = refConfirmpassword.current.value;
        let hotelcover = refHotelcover.current.value;
        let hotelDescription = refHotelDescription.current.value;
        let hotelLocation = refHotelLocation.current.value;
        let hotelName = refHotelName.current.value;

         //function for capitalized each word
         const CapitalizedWord = (word) => {
            let words = word.split(" ");
           return words.map(word => word[0].toUpperCase() + word.substring(1)).join(" ");
        }

         //username validation if already exist
         const inputDataValidation = () => {
            let validation = false;
            Object.values(stateManager).forEach(value => {
                let userName = value['USERNAME'];
                if(userName == username) validation = true;
            });
            return validation;
        }

        if(firstname == ""){
            updateFormError("Enter Your First Name",true,false,"firstname");
            refFirstname.current.focus();
        }
        else if(lastname == ""){
            updateFormError("Enter Your Last Name",true,false,"lastname");
            refLastname.current.focus();
        }
        else if(username == ""){
            updateFormError("Enter Your Username",true,false,"username");
            refUsername.current.focus();
        }
        else if(username.length < 4){
            updateFormError("Username must contain atleast 4 characters",true,false,"username");
            refUsername.current.focus();
        }
        else if(inputDataValidation()){
            updateFormError("Username Already Exist",true,false,"username");
            refUsername.current.focus();
        }
        else if(password == ""){
            updateFormError("Enter Your Password",true,false,"password");
            refPassword.current.focus();
        }
        else if(password.length < 6){
            updateFormError("Password must contain atleast 6 characters",true,false,"password");
            refPassword.current.focus();
        }
        else if(confirmpassword != password){
            updateFormError("Password and Confirm Password do not match",true,false,"confirmpassword");
            refConfirmpassword.current.focus();
        }
        else if(hotelcover == ""){
            updateFormError("Upload Hotel Cover",true,false,"hotelcover");
            refHotelcover.current.focus();
        }
        else if(hotelName == ""){
            updateFormError("Enter Hotel Name",true,false,"hotelName");
            refHotelName.current.focus();
        }
        else if(hotelDescription == ""){
            updateFormError("Enter Hotel Description",true,false,"hotelDescription");
            refHotelDescription.current.focus();
        }
        else if(hotelLocation == ""){
            updateFormError("Enter Hotel Location",true,false,"hotelLocation");
            refHotelLocation.current.focus();
        }
        else{
            firstname = CapitalizedWord(firstname);
            middlename = middlename != "" ? CapitalizedWord(middlename): " ";
            lastname = CapitalizedWord(lastname);
        }
    }

    return(
        <Modal show={showModal} onHide={()=> hideModalForm()} animation={true}  centered>
            <Modal.Header closeButton className={css.modalSignInHeader}>
                    <div>
                        <p>Hotel Manager Sign Up</p>
                        <p>Hotel Account Registration</p>
                    </div>
            </Modal.Header>

            <Modal.Body className={cssSignUp.modalCustomerBody}>
                <Form onSubmit={handleSubmit}>
                    
                    <Form.Group className={`${css.customerInput} ${cssSignUp.conHotelManager}`}>
                            <p>Hotel Manager Account</p>
                            <hr />
                    </Form.Group>

                    <Form.Group className={`${css.customerInput} ${css.conAccountIDCustomer}`}>
                        <Form.Control type="text" disabled value={`ACCOUNT ID:  ${accountID}`} readOnly />
                    </Form.Group>

                    <Form.Group className={`${css.customerInput} ${css.name}`}>
                            <Form.Floating className={css.customerFloating}>
                                <Form.Control ref={refFirstname} type="text" placeholder='First Name' isInvalid={formError.firstname.isInvalid} isValid={formError.firstname.isValid} onChange={() => {formOnchange("firstname")}} />
                                <Form.Control.Feedback className={css.error} type="invalid" tooltip>{formError.firstname.error}</Form.Control.Feedback>
                                <Form.Label>First Name</Form.Label>
                            </Form.Floating>
                        </Form.Group>

                        <Form.Group className={`${css.customerInput} ${css.name}`}>
                            <Form.Floating className={css.customerFloating}>
                                <Form.Control ref={refMiddlename} type="text" placeholder='Middle Name' isInvalid={formError.middlename.isInvalid} isValid={formError.middlename.isValid} onChange={() => {formOnchange("middlename")}} />
                                <Form.Control.Feedback className={css.error} type="invalid" tooltip>{formError.middlename.error}</Form.Control.Feedback>
                                <Form.Label>Middle Name</Form.Label>
                            </Form.Floating>
                        </Form.Group>

                        <Form.Group className={`${css.customerInput} ${css.name}`}>
                            <Form.Floating className={css.customerFloating}>
                                <Form.Control ref={refLastname} type="text" placeholder='Last Name' isInvalid={formError.lastname.isInvalid} isValid={formError.lastname.isValid} onChange={() => {formOnchange("lastname")}} />
                                <Form.Control.Feedback className={css.error}  type="invalid" tooltip>{formError.lastname.error}</Form.Control.Feedback>
                                <Form.Label>Last Name</Form.Label>
                            </Form.Floating>
                        </Form.Group>

                        <Form.Group className={css.customerInput}>
                            <Form.Floating className={css.customerFloating}>
                                <Form.Control ref={refUsername} type="text" placeholder='Username' isInvalid={formError.username.isInvalid} isValid={formError.username.isValid} onChange={() => {formOnchange("username")}}/>
                                <Form.Control.Feedback className={css.error} type="invalid" tooltip>{formError.username.error}</Form.Control.Feedback>
                                <Form.Label>Username</Form.Label>
                            </Form.Floating>
                        </Form.Group>

                        <Form.Group className={css.customerInput}>
                            <Form.Floating className={css.customerFloating}>
                                <Form.Control ref={refPassword} type="password" placeholder='Password' isInvalid={formError.password.isInvalid} isValid={formError.password.isValid} onChange={() => {formOnchange("password")}}/>
                                <Form.Control.Feedback className={css.error} type="invalid" tooltip>{formError.password.error}</Form.Control.Feedback>
                                <Form.Label>Password</Form.Label>
                            </Form.Floating>
                        </Form.Group>
                        
                        <Form.Group className={css.customerInput}>
                            <Form.Floating className={css.customerFloating}>
                                <Form.Control ref={refConfirmpassword} type="password" placeholder='Password' isInvalid={formError.confirmpassword.isInvalid} isValid={formError.confirmpassword.isValid} onChange={() => {formOnchange("confirmpassword")}} />
                                <Form.Control.Feedback className={css.error} type="invalid" tooltip>{formError.confirmpassword.error}</Form.Control.Feedback>
                                <Form.Label>Confirm Password</Form.Label>
                            </Form.Floating>
                        </Form.Group>

                        <Form.Group className={`${css.customerInput} ${cssSignUp.conHotelInformation}`}>
                            <p>Hotel Information</p>
                            <hr />
                        </Form.Group>

                        <Form.Group className={`${css.customerInput} ${css.conProfileCustomer}`}>
                            <Form.Label>Hotel Cover Photo:</Form.Label>
                            <div>
                                <Form.Control type="file" ref={refHotelcover} onChange={()=>{formOnchange("hotelcover")}} isInvalid={formError.hotelcover.isInvalid} isValid={formError.hotelcover.isValid} />
                                <Form.Control.Feedback className={css.error} type="invalid" tooltip>{formError.hotelcover.error}</Form.Control.Feedback>
                            </div>
                        </Form.Group>
                        <div className={cssSignUp.HotelCover}>
                            {hotelCoverComponent()}
                        </div>

                        <Form.Group className={css.customerInput}>
                            <Form.Floating className={css.customerFloating}>
                                <Form.Control ref={refHotelName} type="text" placeholder='Hotel Name' isInvalid={formError.hotelName.isInvalid} isValid={formError.hotelName.isValid} onChange={() => {formOnchange("hotelName")}} />
                                <Form.Control.Feedback className={css.error} type="invalid" tooltip>{formError.hotelName.error}</Form.Control.Feedback>
                                <Form.Label>Hotel Name</Form.Label>
                            </Form.Floating>
                        </Form.Group>

                        <Form.Group className={css.customerInput}>
                            <Form.Label>Hotel Description</Form.Label>
                            <Form.Control className={cssSignUp.hotelDescription} onKeyDown={descriptionKeyDown} ref={refHotelDescription} as="textarea" placeholder='Enter Hotel Description' isInvalid={formError.hotelDescription.isInvalid} isValid={formError.hotelDescription.isValid} onChange={() => {formOnchange("hotelDescription")}} />
                            <Form.Control.Feedback className={css.error} type="invalid" tooltip>{formError.hotelDescription.error}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className={css.customerInput}>
                            <Form.Label>Hotel Location</Form.Label>
                            <Form.Control className={cssSignUp.hotelLocation} onKeyDown={locationKeyDown}  ref={refHotelLocation} as="textarea" placeholder='Enter Hotel Location' isInvalid={formError.hotelLocation.isInvalid} isValid={formError.hotelLocation.isValid} onChange={() => {formOnchange("hotelLocation")}} />
                            <Form.Control.Feedback className={css.error} type="invalid" tooltip>{formError.hotelLocation.error}</Form.Control.Feedback>
                        </Form.Group>

                        <div className={css.customerButton}>
                            <Button type="submit" ref={refSubmit}>Sign Up</Button>
                        </div>
                </Form>
            </Modal.Body>
        </Modal>
        );
}