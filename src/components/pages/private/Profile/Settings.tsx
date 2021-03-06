import * as React from "react";
import {Card, Button, Grid, Dimmer, Loader, Form, Modal, Message} from "semantic-ui-react";
import { Formik } from "formik";
import * as Yup from 'yup';
import userService from "../../../../services/userService";
import { USER_COOKIE_NAME } from "../../../../constants";
import { DisableValuesPropTypes } from "semantic-ui-calendar-react/dist/types/inputs/BaseInput";

//Settings of a user to change email, password, name

interface settingsState {
    isLoading: boolean,
    userdata: {},
    openDeleteAccountModal: boolean,
    openConfirmEmailModal: boolean,
    currentPassword: string,
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
            openDeleteAccountModal: false,
            openConfirmEmailModal: false,
            currentPassword: '',
            openSuccessModal: '',
            isLoadingPassword: false
        }
    }

    async componentDidMount() {
        this.mounted = true;
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

    //function to set a new email in databasa
    updateEmail = async (values, formikBag) => {
        try {           
            const response = await userService.changeEmailRequest(values.currentPassword, values.email);
            if (this.mounted){ this.setState({openConfirmEmailModal: true}) }
        } catch (error){
            if (error.response.status === 401){
                formikBag.setErrors({
                    currentPassword: "Das eingegebene Passwort ist falsch."
                })
            };
        }
    }

    //function to change the name in database
    updateName = async (values, formikBag) => {
        if (this.mounted){ this.setState({openSuccessModal: ''}) }
        try {
            await userService.changeName(values.name);

            const userInfo = await userService.getUserinfos();

            if(this.mounted) {
                this.setState({
                    userdata: userInfo.data,
                    currentPassword: '', 
                    openSuccessModal: 'Name'
                })
            }
        } catch (e){
        }

    }

    submitProfileInfoForm = async (values,formikBag) => {
        if (this.mounted){ this.setState({isLoading: true, openSuccessModal: ''}) }
        try {
            //no changes 
            if (this.state.userdata['name'] === values.name && this.state.userdata['email'] === values.email){
                //show errors in form
                formikBag.setErrors({
                    email: "Es wurde keine Änderung an der Email vorgenommen.",
                    name: "Es wurde keine Änderung an dem Namen vorgenommen."
                })
            } 

            //email and name changes
            else if (this.state.userdata['name'] != values.name && this.state.userdata['email'] != values.email){

                //update name, then email
                this.updateName(values, formikBag);
                this.updateEmail(values, formikBag);

            }

            //only name changes
            else if (this.state.userdata['name'] != values.name && this.state.userdata['email'] === values.email){

                //update name
                this.updateName(values, formikBag);
            }

            //only email changes
            else if (this.state.userdata['name'] === values.name && this.state.userdata['email'] != values.email){
                
                //update Email
                this.updateEmail(values, formikBag);
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
            const response = await userService.changePassword(values.currentPassword, values.newPassword);

            if (this.mounted){ this.setState({isLoadingPassword: false, openSuccessModal: 'Passwort'}) }
            formikBag.resetForm();
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

    deleteAccountPermanently = async (values, formikBag) => {
        if (this.mounted){
            try {                
                await userService.deactivateAccount(values.password);
                this.setState({openDeleteAccountModal: false});
                this.props.closeModal();
                localStorage.removeItem(USER_COOKIE_NAME);
                this.props.history.push('/');                
            } catch (error){
                if (error.response.status === 404){
                    if (this.mounted){
                        formikBag.setErrors({
                            password: "Das eingegebene Passwort ist falsch."
                        })
                    }
                }
            }
        }
    }

    verifyEmailChange = async (values, formikBag) => {
        try {
            await userService.changeEmailConfirm(values.oldEmailCode, values.newEmailCode);

            const userInfo = await userService.getUserinfos();

            if(this.mounted) {
                this.setState({
                    userdata: userInfo.data
                })
            }
            if (this.mounted) { this.setState({openConfirmEmailModal: false, currentPassword: '', openSuccessModal: 'Email'}) };
        } catch (error){
            if (error.response.status === 409){
                if(error.response.data.includes("neu")){
                    formikBag.setErrors({
                        newEmailCode: "Der Code für die neue Email ist falsch."
                    })
                } else if(error.response.data.includes("alt")){
                    formikBag.setErrors({
                        oldEmailCode: "Der Code für die alte Email ist falsch."
                    })
                }
            }
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
                                        currentPassword: this.state.currentPassword,
                                        name: this.state.userdata['name'],
                                        email: this.state.userdata['email'],
                                    }}
                                    validationSchema= {Yup.object().shape({
                                        currentPassword: Yup.string()
                                            .required('Passwort ist erforderlich.')
                                            .min(9, 'Passwort muss aus mindestens 9 Zeichen bestehen.'),
                                        name: Yup.string()
                                            .required('Name ist erforderlich.'),
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
                                                label='Aktuelles Passwort'
                                                placeholder='Aktuelles Passwort'
                                                value={values.currentPassword}
                                                name="currentPassword" 
                                                type="password"
                                                onChange={handleChange} 
                                                onBlur={handleBlur}
                                                error={(errors.currentPassword && touched.currentPassword) ? { content: errors.currentPassword, pointing: 'above' } : false}/>
                                            <Form.Input 
                                                label='Name'
                                                value={values.name}
                                                name="name" 
                                                type="text"
                                                onChange={handleChange} 
                                                onBlur={handleBlur}
                                                error={(errors.name && touched.name) ? { content: errors.name, pointing: 'above' } : false}/>
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
                        <Card centered style={{'marginTop': '40px'}}>
                            <Button onClick={() => this.setState({openDeleteAccountModal: true})}>
                                Konto deaktivieren
                            </Button>
                        </Card>
                    </Grid.Column>
                    <Grid.Column computer={1}></Grid.Column>
                </Grid.Row>
                {(this.state.openSuccessModal === "Name" || this.state.openSuccessModal === "Email" || this.state.openSuccessModal === "Passwort" || this.state.openSuccessModal === "Name und Email") &&
                <Grid.Row>
                    <Message success style={{"marginTop": "20px"}} >
                        {this.state.openSuccessModal} {this.state.openSuccessModal === "Name und Email" ? "wurden" : "wurde"} erfolgreich geändert.
                    </Message>
                </Grid.Row>
                }

                <Modal open={this.state.openDeleteAccountModal} onClose={() => this.setState({openDeleteAccountModal: false})} closeIcon>
                    <Modal.Header>
                        Konto deaktivieren
                    </Modal.Header>
                    <Modal.Content>
                        Verifizieren Sie sich mit ihrem Passwort, um das Konto zu deaktivieren.
                        <br/><br/>
                        <Formik
                            initialValues={{
                                password: '',
                            }}
                            validationSchema= {Yup.object().shape({
                                password: Yup.string()
                                    .required('Passwort ist erforderlich.')
                                    .min(9, 'Passwort muss aus mindestens 9 Zeichen bestehen.')
                            })}
                            onSubmit={this.deleteAccountPermanently}
                            enableReinitialize
                        >
                            {({ errors, touched, handleChange, handleBlur, handleSubmit, values }) => (
                                <Form onSubmit={handleSubmit}>
                                    <Form.Input 
                                        placeholder='Passwort eingeben'
                                        value={values.password}
                                        name="password" 
                                        type="password"
                                        onChange={handleChange} 
                                        onBlur={handleBlur}
                                        error={(errors.password && touched.password) ? { content: errors.password, pointing: 'above' } : false}
                                    />
                                    <Button type='submit'>Konto deaktivieren</Button>
                                </Form>
                            )}
                        </Formik>                        
                    </Modal.Content>
                </Modal>
                <Modal style={{'marginTop': '20px'}} open={this.state.openConfirmEmailModal} onClose={() => this.setState({openConfirmEmailModal: false})} closeIcon>
                    <Modal.Header>
                        Email-Änderung bestätigen
                    </Modal.Header>
                    <Modal.Content>
                        Bestätigen Sie ihre Änderung der Email mit den beiden Code, die sie an die alte sowie an die neue Email erhalten haben.
                        <br/><br/>
                        <Formik
                            initialValues={{
                                oldEmailCode: '',
                                newEmailCode: ''
                            }}
                            validationSchema= {Yup.object().shape({
                                oldEmailCode: Yup.string()
                                    .required('Code ist erforderlich.')
                                    .matches(/^[0-9]{5}$/, 'Code muss aus 5 Zeichen bestehen.'),
                                newEmailCode: Yup.string()
                                    .required('Code ist erforderlich.')
                                    .matches(/^[0-9]{5}$/, 'Code muss aus 5 Zeichen bestehen.')
                            })}
                            onSubmit={this.verifyEmailChange}
                            enableReinitialize
                        >
                            {({ errors, touched, handleChange, handleBlur, handleSubmit, values }) => (
                                <Form onSubmit={handleSubmit}>
                                    <Form.Input 
                                        label="Code der alten Email eingeben"
                                        placeholder='Code der alten Email'
                                        value={values.oldEmailCode}
                                        name="oldEmailCode" 
                                        type="number"
                                        onChange={handleChange} 
                                        onBlur={handleBlur}
                                        error={(errors.oldEmailCode && touched.oldEmailCode) ? { content: errors.oldEmailCode, pointing: 'above' } : false}
                                    />
                                    <Form.Input 
                                        label="Code der neuen Email eingeben"
                                        placeholder='Code der neuen Email'
                                        value={values.newEmailCode}
                                        name="newEmailCode" 
                                        type="number"
                                        onChange={handleChange} 
                                        onBlur={handleBlur}
                                        error={(errors.newEmailCode && touched.newEmailCode) ? { content: errors.newEmailCode, pointing: 'above' } : false}
                                    />
                                    <Button type='submit'>Bestätigen</Button>
                                </Form>
                            )}
                        </Formik>                        
                    </Modal.Content>
                </Modal>
            </React.Fragment>
        )
    }
}

export default Settings;




