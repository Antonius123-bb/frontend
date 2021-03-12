import * as React from "react";
import {Card, Button, Grid, Dimmer, Loader, Form, Modal, Message} from "semantic-ui-react";
import { Formik } from "formik";
import * as Yup from 'yup';
import userService from "../../../../services/userService";
import { USER_COOKIE_INFO } from "../../../../constants";
import { DisableValuesPropTypes } from "semantic-ui-calendar-react/dist/types/inputs/BaseInput";
import presentationService from "../../../../services/presentationService";

//Settings of a user to change email, password, name

interface settingsState {
    isLoading: boolean,
    userdata: {},
    openSuccessModal: string,
    isLoadingPassword: boolean
}

class Settings extends React.Component<{userdata: {}, history: any, closeModal: any}, settingsState> {

    private mounted: boolean = false;

    constructor(props: any) {
        super(props);

        this.state = {
            isLoading: false,
            userdata: this.props.userdata,
            openSuccessModal: '',
            isLoadingPassword: false
        }
    }

    async componentDidMount() {
        this.mounted = true;

        await presentationService.bookSeats(
            [1],
            "604ba09cd92a5928e02d1954",
            JSON.parse(localStorage.getItem(USER_COOKIE_INFO)).id,
            "bar"
        )
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    componentDidUpdate(prevProps) {
        if(prevProps.userdata != this.props.userdata) {
            if (this.mounted){
                this.setState({
                    userdata: this.props.userdata
                })
            }
        }
    }

    submitProfileInfoForm = async (values,formikBag) => {
        if (this.mounted){ this.setState({isLoading: true, openSuccessModal: ''}) }
        try {
            //no changes 
            if (this.state.userdata['name'] === values.name && this.state.userdata['email'] === values.email && this.state.userdata['lastName'] === values.lastName){
                //show errors in form
                formikBag.setErrors({
                    email: "Es wurde keine Änderung an der Email vorgenommen.",
                    name: "Es wurde keine Änderung an dem Vornamen vorgenommen.",
                    lastName: "Es wurde keine Änderung an dem Nachnamen vorgenommen."
                })
            } 
            else {
                const addresses = JSON.parse(localStorage.getItem(USER_COOKIE_INFO)).addresses;
                const id = JSON.parse(localStorage.getItem(USER_COOKIE_INFO)).id;
                const response = await userService.updateUserById(
                    values.name, 
                    values.lastName, 
                    values.email, 
                    addresses, 
                    id
                )
                let obj = {
                    addresses: addresses,
                    email: values.email,
                    id: id,
                    lastName: values.lastName,
                    name: values.name
                }

                localStorage.setItem(USER_COOKIE_INFO, JSON.stringify(obj));

                let messageString = '';
                let nameChanged = this.state.userdata['name'] != values.name;
                let emailChanged = this.state.userdata['email'] != values.email;
                let lastNameChanged = this.state.userdata['lastName'] != values.lastName;

                if(nameChanged && emailChanged && lastNameChanged){
                    messageString =  "Vorname, Nachname und Email";
                } else if (nameChanged && emailChanged && !lastNameChanged){
                    messageString =  "Vorname und Email";
                } else if (nameChanged && !emailChanged && lastNameChanged){
                    messageString =  "Vorname und Nachname";
                } else if (!nameChanged && emailChanged && lastNameChanged){
                    messageString =  "Nachname und Email";
                } else if (!nameChanged && !emailChanged && lastNameChanged){
                    messageString =  "Nachname";
                } else if (nameChanged && !emailChanged && !lastNameChanged){
                    messageString =  "Vorname";
                } else if (!nameChanged && emailChanged && !lastNameChanged){
                    messageString =  "Email";
                }
                
                if (this.mounted){ this.setState({isLoadingPassword: false, userdata: JSON.parse(localStorage.getItem(USER_COOKIE_INFO)), openSuccessModal: messageString}) };
                formikBag.resetForm();
            }

            if (this.mounted){ this.setState({isLoading: false}) }
        }
        catch (e){
            if (this.mounted){ this.setState({isLoading: false}) }
        }

    }

    changePasswordForm = async (values, formikBag) => {
        if (this.mounted){ this.setState({isLoadingPassword: true, openSuccessModal: ''}) }
        try {
            if(values.confirmPassword === values.newPassword){
                const userId = JSON.parse(localStorage.getItem(USER_COOKIE_INFO)).id;
                const response = await userService.changePassword(userId, values.currentPassword, values.newPassword);
    
                if (this.mounted){ this.setState({isLoadingPassword: false, openSuccessModal: 'Passwort'}) }
                formikBag.resetForm();
            } else {
                formikBag.setErrors({
                    confirmPassword: "Die angegebenen Passwörter stimmen nicht überein.",
                    newPassword: "Die angegebenen Passwörter stimmen nicht überein."
                })
                if (this.mounted){ this.setState({isLoadingPassword: false}) }
            }
        }
        catch (error){
            if(error.response.status === 401){
                formikBag.setErrors({
                    currentPassword: "Das angegebene Passwort ist falsch."
                })
            }
            if (this.mounted){ this.setState({isLoadingPassword: false}) }
        }
    }
    
    render() {

        return (
            <React.Fragment>
                <Grid.Row columns={4}>
                    <Grid.Column computer={1}></Grid.Column>
                    <Grid.Column computer={14}>
                        <Card.Group itemsPerRow={2}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>Profildaten ändern</Card.Header>
                            </Card.Content>
                            <Card.Content>
                                <Formik
                                    initialValues={{
                                        name: this.state.userdata['name'],
                                        lastName: this.state.userdata['lastName'],
                                        email: this.state.userdata['email'],
                                    }}
                                    validationSchema= {Yup.object().shape({
                                        name: Yup.string()
                                            .required('Vorname ist erforderlich.'),
                                        lastName: Yup.string()
                                                .required('Nachname ist erforderlich.'),
                                        email: Yup.string()
                                            .required('Email ist erforderlich.')
                                            .email('Email ist nicht korrekt.'),
                                    })}
                                    onSubmit={this.submitProfileInfoForm}
                                    enableReinitialize
                                >
                                    {({ errors, touched, handleChange, handleBlur, handleSubmit, values }) => (
                                        <Form onSubmit={handleSubmit}>
                                            <Dimmer active={this.state.isLoading} inverted>
                                                <Loader inverted content='Lädt' />
                                            </Dimmer>
                                            <Form.Input 
                                                label='Vorname'
                                                value={values.name}
                                                name="name" 
                                                type="text"
                                                onChange={handleChange} 
                                                onBlur={handleBlur}
                                                error={(errors.name && touched.name) ? { content: errors.name, pointing: 'above' } : false}/>
                                            <Form.Input 
                                                label='Nachname'
                                                value={values.lastName}
                                                name="lastName" 
                                                type="text"
                                                onChange={handleChange} 
                                                onBlur={handleBlur}
                                                error={(errors.lastName && touched.lastName) ? { content: errors.lastName, pointing: 'above' } : false}/>
                                            <Form.Input 
                                                label='Email'
                                                value={values.email}
                                                name="email" 
                                                type="text"
                                                onChange={handleChange} 
                                                onBlur={handleBlur}
                                                error={(errors.email && touched.email) ? { content: errors.email, pointing: 'above' } : false}/>
                                            <Button type='submit'>Speichern</Button>
                                        </Form>
                                    )}
                                </Formik>
                            </Card.Content>
                        </Card>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>Passwort ändern</Card.Header>
                            </Card.Content>
                            <Card.Content>
                                <Formik
                                    initialValues={{
                                        currentPassword: '',
                                        newPassword: '',
                                        confirmPassword: ''
                                    }}
                                    validationSchema= {Yup.object().shape({
                                        currentPassword: Yup.string()
                                            .required('Passwort ist erforderlich.')
                                            .min(9, 'Passwort muss aus mindestens 9 Zeichen bestehen.'),
                                        newPassword: Yup.string()
                                            .required('Passwort ist erforderlich.')
                                            .min(9, 'Passwort muss aus mindestens 9 Zeichen bestehen.'),
                                        confirmPassword: Yup.string()
                                            .required('Passwort ist erforderlich.')
                                            .min(9, 'Passwort muss aus mindestens 9 Zeichen bestehen.'),
                                    })}
                                    onSubmit={this.changePasswordForm}
                                    enableReinitialize
                                >
                                    {({ errors, touched, handleChange, handleBlur, handleSubmit, values }) => (
                                        <Form onSubmit={handleSubmit}>
                                            <Dimmer active={this.state.isLoadingPassword} inverted>
                                                <Loader inverted content='Lädt' />
                                            </Dimmer>
                                            <Form.Input 
                                                label='Aktuelles Passwort'
                                                placeholder='Aktuelles Passwort'
                                                value={values.currentPassword}
                                                name="currentPassword" 
                                                type="password"
                                                onChange={handleChange} 
                                                onBlur={handleBlur}
                                                error={(errors.currentPassword && touched.currentPassword) ? { content: errors.currentPassword, pointing: 'above' } : false}/>
                                            <Form.Input 
                                                label='Neues Passwort'
                                                placeholder='Neues Passwort'
                                                value={values.newPassword}
                                                name="newPassword" 
                                                type="password"
                                                onChange={handleChange} 
                                                onBlur={handleBlur}
                                                error={(errors.newPassword && touched.newPassword) ? { content: errors.newPassword, pointing: 'above' } : false}/>
                                            <Form.Input 
                                                label='Passwort bestätigen'
                                                placeholder='Passwort bestätigen'
                                                value={values.confirmPassword}
                                                name="confirmPassword" 
                                                type="password"
                                                onChange={handleChange} 
                                                onBlur={handleBlur}
                                                error={(errors.confirmPassword && touched.confirmPassword) ? { content: errors.confirmPassword, pointing: 'above' } : false}/>
                                            <Button type='submit'>Passwort ändern</Button>
                                        </Form>
                                    )}
                                </Formik>
                            </Card.Content>
                        </Card>
                        </Card.Group>
                    </Grid.Column>
                    <Grid.Column computer={1}></Grid.Column>
                </Grid.Row>
                {(this.state.openSuccessModal != '') &&
                <Grid.Row>
                    <Message success style={{"marginTop": "20px"}} >
                        {this.state.openSuccessModal} erfolgreich geändert.
                    </Message>
                </Grid.Row>
                }
            </React.Fragment>
        )
    }
}

export default Settings;




