import {Modal, Button, Form } from 'react-bootstrap';
import cssSignUp from '../../styles/Components/hotelManager.module.css';
import css from '../../styles/Components/modalSignIn.module.css';
import cssHome from '../../styles/Pages/Home.module.css';
import {useState, useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { showModalHotelManager } from '../../redux/reduxSlice/hotelSlice';
import { addHotelManager } from '../../redux/reduxSlice/userSlice';
import { getHotel } from '../../redux/reduxSlice/hotelSlice';
import {database} from '../../firebase/firebaseConfig';
import { ref, set } from "firebase/database";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export default function Hotelmanager({accountId}){
    //import variables------------------------------------------------------------
    const dispatch = useDispatch();
    const mySwal = withReactContent(Swal);

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
        hotelRoom:{
            ...errorObject,  
        }
    });
    const [hotelCover, setHotelCover] = useState("");
    const [hotelRoom, setHotelRoom] = useState("");

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
    const refHotelRoom = useRef();
    const refSubmit = useRef();
    
    //redux state-------------------------------------------------------------------
    const showModal = useSelector(state => state.storeHotel.hotelManagerAccount);
    const stateManager = useSelector(state => state.storeUsers.hotelManagerAcct);
    
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

            case "hotelRoom":
                let inputHotelRoom = refHotelRoom.current.value;
                setHotelRoom(value => refHotelRoom.current.validity.valid ? inputHotelRoom : value);
                isNaN(inputHotelRoom) ? updateFormError("",false,false,"hotelRoom") : updateFormError("",false,true,"hotelRoom");
                inputHotelRoom == "" ? updateFormError("",false,false,"hotelRoom") : null;
            break;
        }
    }

    //Modal Hide function------------------------------------------------------------
    const hideModalForm = () => {
        setHotelRoom("");
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
            },
            hotelRoom:{
                ...errorObject,  
            }
        });
    }
    
    //Set Hotel Cover Image Component------------------------------------------------
    const hotelCoverComponent = () => {
        return hotelCover != "" ? (
             <div className={`${cssSignUp.conHotelCoverImage} ${css.profileIcon}`}>
                 <img src={hotelCover} alt="Resort Cover Picture" />
             </div>
         ) : (
        <div className={`${cssSignUp.conHotelCover} ${css.profileIcon}`}>
             <img src='/image/image_icon.png' alt="Resort Cover Picture" />
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
        let hotelRoom = refHotelRoom.current.value;

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
            updateFormError("Upload Resort Cover",true,false,"hotelcover");
            refHotelcover.current.focus();
        }
        else if(hotelName == ""){
            updateFormError("Enter Resort Name",true,false,"hotelName");
            refHotelName.current.focus();
        }
        else if(hotelDescription == ""){
            updateFormError("Enter Resort Description",true,false,"hotelDescription");
            refHotelDescription.current.focus();
        }
        else if(hotelLocation == ""){
            updateFormError("Enter Resort Location",true,false,"hotelLocation");
            refHotelLocation.current.focus();
        }
        else if(hotelRoom == ""){
            updateFormError("Enter Number of Resort Rooms",true,false,"hotelRoom");
            refHotelRoom.current.focus();
        }
        else{
            firstname = CapitalizedWord(firstname);
            middlename = middlename != "" ? CapitalizedWord(middlename): " ";
            lastname = CapitalizedWord(lastname);
            hotelName = CapitalizedWord(hotelName);
            hotelDescription = CapitalizedWord(hotelDescription);
            hotelLocation = CapitalizedWord(hotelLocation);

            try{
                let file = refHotelcover.current.files[0];
                let imageFiletype = `data:${file.type};base64,`;
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    
                    dispatch(addHotelManager({
                        [accountId]: {
                            "FIRSTNAME": firstname,
                            "ID": accountId,
                            "LASTNAME": lastname,
                            "MIDDLENAME": middlename,
                            "PASSWORD": password,
                            "USERNAME": username,
                        }
                    }));

                    set(ref(database, `ADMIN/HOTEL-MANAGER/${accountId}`),{
                        "FIRSTNAME": firstname,
                        "ID": accountId,
                        "LASTNAME": lastname,
                        "MIDDLENAME": middlename,
                        "PASSWORD": password,
                        "USERNAME": username,
                    })
                    .catch((error) => {
                        console.log(error);
                    });

                    dispatch(getHotel({
                        [accountId]: {
                            "HOTEL-COVER": reader.result.substring(imageFiletype.length),
                            "HOTEL-DESCRIPTION": hotelDescription,
                            "HOTEL-LOCATION": hotelLocation,
                            "HOTEL-NAME": hotelName,
                            "HOTEL-REFERENCE NUMBER": accountId,
                            "RATING-TOTAL ACCOMODATION": 0,
                            "RATING-USER RATING": 0,
                            "ROOMS": parseInt(hotelRoom),
                            "VIEW-ROOM GALLERY":{
                                "ROOM-01": "N/A",
                                "ROOM-02": "N/A"
                            },
                            "VIEW-USER COMMENTS":{
                                "COMMENT-COUNT": 0,
                            }
                        }
                    }));

                    set(ref(database, `HOTEL-RESERVATION-SYSTEM/HOTELS/${accountId}`),{
                            "HOTEL-COVER": reader.result.substring(imageFiletype.length),
                            "HOTEL-DESCRIPTION": hotelDescription,
                            "HOTEL-LOCATION": hotelLocation,
                            "HOTEL-NAME": hotelName,
                            "HOTEL-REFERENCE NUMBER": accountId,
                            "RATING-TOTAL ACCOMODATION": 0,
                            "RATING-USER RATING": 0,
                            "ROOMS": parseInt(hotelRoom),
                            "VIEW-ROOM GALLERY":{
                                "ROOM-01": "N/A",
                                "ROOM-02": "N/A"
                            },
                            "VIEW-USER COMMENTS":{
                                "COMMENT-COUNT": 0,
                            }
                    })
                    .then(() => {
                        mySwal.fire({
                            icon: 'success',
                            title: <p className={cssHome.swalText}>Account has been successfully registered</p>,
                            customClass:{
                              confirmButton: `${cssHome.swalButton}`,
                            }
                          });
                        hideModalForm();
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                };
            }
            catch(error){
                console.log(error);
            }
        }
    }

    return(
        <Modal show={showModal} onHide={()=> hideModalForm()} animation={true}  centered>
            <Modal.Header closeButton className={css.modalSignInHeader}>
                    <div>
                        <p>Resort Manager Sign Up</p>
                        <p>Resort Account Registration</p>
                    </div>
            </Modal.Header>

            <Modal.Body className={cssSignUp.modalCustomerBody}>
                <Form onSubmit={handleSubmit}>
                    
                    <Form.Group className={`${css.customerInput} ${cssSignUp.conHotelManager}`}>
                            <p>Resort Manager Account</p>
                            <hr />
                    </Form.Group>

                    <Form.Group className={`${css.customerInput} ${css.conAccountIDCustomer}`}>
                        <Form.Control type="text" disabled value={`ACCOUNT ID:  ${accountId}`} readOnly />
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
                            <p>Resort Information</p>
                            <hr />
                        </Form.Group>

                        <Form.Group className={`${css.customerInput} ${css.conProfileCustomer}`}>
                            <Form.Label>Resort Cover Photo:</Form.Label>
                            <div>
                                <Form.Control type="file" ref={refHotelcover} onChange={()=>{formOnchange("hotelcover")}} isInvalid={formError.hotelcover.isInvalid} isValid={formError.hotelcover.isValid} />
                                <Form.Control.Feedback className={css.error} type="invalid" tooltip>{formError.hotelcover.error}</Form.Control.Feedback>
                            </div>
                        </Form.Group>
                        <div className={cssSignUp.HotelCover}>
                            {hotelCoverComponent()}
                        </div>

                        <Form.Group className={`${css.customerInput} ${css.name}`}>
                            <Form.Floating className={css.customerFloating}>
                                <Form.Control ref={refHotelName} type="text" placeholder='Resort Name' isInvalid={formError.hotelName.isInvalid} isValid={formError.hotelName.isValid} onChange={() => {formOnchange("hotelName")}} />
                                <Form.Control.Feedback className={css.error} type="invalid" tooltip>{formError.hotelName.error}</Form.Control.Feedback>
                                <Form.Label>Resort Name</Form.Label>
                            </Form.Floating>
                        </Form.Group>

                        <Form.Group className={css.customerInput}>
                            <Form.Label>Resort Description</Form.Label>
                            <Form.Control className={cssSignUp.hotelDescription} onKeyDown={descriptionKeyDown} ref={refHotelDescription} as="textarea" placeholder='Enter Resort Description' isInvalid={formError.hotelDescription.isInvalid} isValid={formError.hotelDescription.isValid} onChange={() => {formOnchange("hotelDescription")}} />
                            <Form.Control.Feedback className={css.error} type="invalid" tooltip>{formError.hotelDescription.error}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className={css.customerInput}>
                            <Form.Label>Resort Location</Form.Label>
                            <Form.Control className={cssSignUp.hotelLocation} onKeyDown={locationKeyDown}  ref={refHotelLocation} as="textarea" placeholder='Enter Resort Location' isInvalid={formError.hotelLocation.isInvalid} isValid={formError.hotelLocation.isValid} onChange={() => {formOnchange("hotelLocation")}} />
                            <Form.Control.Feedback className={css.error} type="invalid" tooltip>{formError.hotelLocation.error}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className={css.customerInput}>
                            <Form.Label>Number of Resort Rooms</Form.Label>
                            <Form.Control className={cssSignUp.hotelRoom} ref={refHotelRoom} type="text" pattern="[0-9]*" value={hotelRoom} placeholder='Enter Number of Resort Rooms' isInvalid={formError.hotelRoom.isInvalid} isValid={formError.hotelRoom.isValid} onChange={() => {formOnchange("hotelRoom")}} />
                            <Form.Control.Feedback className={css.error} type="invalid" tooltip>{formError.hotelRoom.error}</Form.Control.Feedback>
                        </Form.Group>

                        <div className={css.customerButton}>
                            <Button type="submit" ref={refSubmit}>Sign Up</Button>
                        </div>
                </Form>
            </Modal.Body>
        </Modal>
        );
}