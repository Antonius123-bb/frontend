import * as React from 'react';
import * as Yup from 'yup';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';
import { Formik } from 'formik';
import userService from '../../../services/userService';

/*
* Signup component to give an user the oppurunity to become part of our kino system
*/

interface signupState {
    email: string,
    username: string,
    name: string,
    password: string,
    passwordCheck: string
}

class Signup extends React.Component<{ handleUserManagement: any }, signupState> {

    constructor(props: any) {
        super(props);
        this.state = {
            email: '',
            username: '',
            name: '',
            password: '',
            passwordCheck: ''
        };
    }

    //method to handle an form submit and send the register request
    submitSignupForm = async (values, formikBag) => {
        formikBag.setSubmitting(true);
        try {
            //send the request
            const response = await userService.registerUser(values.firstName, values.lastName, values.password, values.email);

            if (response){
                //send checkEmail to parent component -> opens another modal
                this.props.handleUserManagement('registerSuccess')
            }

            formikBag.setSubmitting(false);
        } catch (error) {
            //handle some potential errors and set formik bags to let the user know what is going on
            console.log("Error ", error)
            if (error.response.status === 409){
                formikBag.setErrors({
                    email: "Zu der angegebenen Email-Adresse existiert bereits ein Konto."
                })
            } else if (error.response.status === 403){
                formikBag.setErrors({
                    name: "Bitte geben Sie Ihren vollständigen Namen (Vor- und Nachname) ein."
                })
            }
            formikBag.setSubmitting(false);
        }
        formikBag.setSubmitting(false);
    };


    render() {
        return (
            /*formik and yup setup*/
            <Formik
                initialValues={{
                    email: '',
                    name: '',
                    password: '',
                    passwordCheck: '',
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().email()
                        .required('Email ist erforderlich.')
                        .max(254, 'Email darf maximal 254 Zeichen beinhalten.'),
                    firstName: Yup.string()
                        .required('Vorname ist erforderlich.')
                        .max(60, 'Vorname darf maximal 60 Zeichen beinhalten.')
                        .min(2, 'Vorname muss aus mindestens 2 Zeichen bestehen.'),
                    lastName: Yup.string()
                        .required('Nachname ist erforderlich.')
                        .max(60, 'Nachname darf maximal 60 Zeichen beinhalten.')
                        .min(2, 'Nachname muss aus mindestens 2 Zeichen bestehen.'),
                    password: Yup.string()
                        .required('Passwort ist erforderlich')
                        .max(50, 'Passwort darf maximal 50 Zeichen beinhalten.')
                        .min(9, 'Passwort muss aus mindestens 9 Zeichen bestehen.'),
                    passwordCheck: Yup.string()
                        .required('Passwort erforderlich')
                        .min(9, 'Passwort muss aus mindestens 9 Zeichen bestehen.')
                        .max(50, 'Passwort darf maximal 50 Zeichen beinhalten.')
                        .when("password", {
                            is: val => (val && val.length > 0 ? true : false),
                            then: Yup.string().oneOf([Yup.ref("password")], 'Passwörter sind nicht gleich.')
                        })
                })}
                onSubmit={this.submitSignupForm}
            >

                {({ errors, touched, handleChange, handleBlur, handleSubmit }) => (
                    <Grid style={{'marginTop': '50px', 'marginBottom': '50px'}} textAlign='center'>
                        <Grid.Column style={{ maxWidth: 450 }}>
                            <Header as='h1' textAlign='center'>
                                <Image src='../../../../src/assets/images/favicon.png'/>
                                <span style={{'color': '#557A95'}}>Corona Kino</span>
                            </Header>
                            <p>Hier können Sie Kinotickets reservieren und buchen.</p>
                            <Header as='h2' textAlign='center'>
                                <span style={{'color': '#557A95'}}>Registrieren</span>
                            </Header>
                            <Message color='grey'
                                attached>Registrieren Sie sich mit ihren Daten.</Message>
                            <Form onSubmit={handleSubmit}>
                                <Segment stacked>
                                    <Form.Input
                                        fluid icon="at"
                                        iconPosition="left"
                                        placeholder='Email'
                                        name="email"
                                        type="text"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={(errors.email && touched.email) ? { content: errors.email, pointing: 'above' } : false} />
                                    <Form.Input
                                        fluid icon="pencil alternate"
                                        iconPosition="left"
                                        placeholder='Vorname'
                                        name="firstName"
                                        type="text"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={(errors.firstName && touched.firstName) ? { content: errors.firstName, pointing: 'above' } : false} />
                                    <Form.Input
                                        fluid icon="pencil alternate"
                                        iconPosition="left"
                                        placeholder='Nachname'
                                        name="lastName"
                                        type="text"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={(errors.lastName && touched.lastName) ? { content: errors.lastName, pointing: 'above' } : false} />  
                                    <Form.Input
                                        fluid icon="lock"
                                        iconPosition="left"
                                        placeholder='Passwort eingeben'
                                        name="password"
                                        type="password"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={(errors.password && touched.password) ? { content: errors.password, pointing: 'above' } : false} />
                                    <Form.Input
                                        fluid icon="lock"
                                        iconPosition="left"
                                        placeholder='Passwort bestätigen'
                                        name="passwordCheck"
                                        type="password"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={(errors.passwordCheck && touched.passwordCheck) ? { content: errors.passwordCheck, pointing: 'above' } : false} />
                                    <Button style={{'background': '#557A95', 'color': '#ffffff'}} fluid size='large' type="submit">Registrieren</Button>
                                </Segment>
                            </Form>
                            <Message>
                                Ich habe bereits einen Account. &nbsp;
                                <a style={{'cursor': 'pointer', 'color': '#557A95'}} onClick={() => this.props.handleUserManagement('login')}>Einloggen</a>
                            </Message>
                        </Grid.Column>
                    </Grid>
                )}
            </Formik>
        )
    }
}
export default Signup;