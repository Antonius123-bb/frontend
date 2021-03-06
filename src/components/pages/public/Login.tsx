import * as React from "react";
import {Button, Form, Grid, Header, Image, Message, Segment, Modal} from "semantic-ui-react";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ALL_ADDRESSES, USER_COOKIE_NAME } from '../../../constants';
import userService from '../../../services/userService';

interface loginState {
}

class Login extends React.Component<{ handleUserManagement: any, handleOpenModalState: any }, loginState> {
    private mounted: boolean = false;

    constructor(props: any) {
        super(props);
    }

    componentDidMount(): void {
        this.mounted = true;
    }

    componentWillUnmount(): void {
        this.mounted = false;
    }

    submitLogin = async (values, formikBag) => {
        if (this.mounted){ formikBag.setSubmitting(true) }        
        try {
            const response = await userService.login(values.email, values.password);            

            if(response) {
                const user = {
                    name: response.data.name,
                    authToken: response.data.authToken
                }
                localStorage.setItem(USER_COOKIE_NAME, JSON.stringify(user));
                const adresses = await userService.getUserinfos();
                if (adresses.data.adresses && adresses.data.adresses != null){
                    localStorage.setItem(ALL_ADDRESSES, JSON.stringify(adresses.data.adressen));
                }

            }

            // close Modal
            this.props.handleOpenModalState(false);

            if (this.mounted){ formikBag.setSubmitting(false) } 
        }
        catch(error) {
            if (error.response.status === 409){
                if (this.mounted){
                    formikBag.setErrors({
                        email: "Das angegebene Konto scheint nicht zu existieren."
                    })
                }
            } if (error.response.status === 423){
                if (this.mounted){
                    formikBag.setErrors({
                        email: "Das angegebene Konto wurde deaktiviert."
                    })
                }
            } else if (error.response.status === 403 || error.response.status === 401){
                if (this.mounted){
                    formikBag.setErrors({
                        email: "Email und Passwort stimmen nicht überein.",
                        password: "Email und Passwort stimmen nicht überein."
                    })
                }
            }
            if (this.mounted){ formikBag.setSubmitting(false) } 
        }
    }

    render() {
        return (
            <Modal.Content>
                <Formik
                    initialValues={{
                        email: '',
                        password: '',
                    }}
                    validationSchema={Yup.object().shape({
                        email: Yup.string()
                            .required('Email ist erforderlich.')
                            .max(254, 'Email darf maximal 254 Zeichen beinhalten.'),
                        password: Yup.string()
                            .required('Passwort ist erforderlich.')
                            .min(9, 'Passwort muss aus mindestens 9 Zeichen bestehen.')
                            .max(50, 'Passwort darf maximal 50 Zeichen beinhalten.'),
                    })}
                    onSubmit={this.submitLogin}
                >
                    {({ errors, touched, handleChange, handleBlur, handleSubmit }) => (
                        <Grid style={{'marginTop': '50px', 'marginBottom': '50px'}} textAlign='center'>
                            <Grid.Column style={{ maxWidth: 450 }}>
                                <Header as='h1' color='purple' textAlign='center'>
                                    <Image src='../../../../src/assets/images/favicon.png'/>
                                    <span style={{'color': '#94618E'}}> DHBW KINO</span>
                                </Header>
                                <p>Hier können Sie Kinotickets reservieren und buchen.</p>
                                <Header as='h2' textAlign='center'>
                                    <span style={{'color': '#94618E'}}>Einloggen</span>
                                </Header>
                                <Message color='grey'
                                    attached>Melden Sie sich mit ihren Zugangsdaten an.</Message>
                                <Form onSubmit={handleSubmit} data-testid="login-form">
                                    <Segment stacked>
                                        <Form.Input fluid icon="at" iconPosition="left"
                                            placeholder='Email'
                                            data-testid="email"
                                            name="email" type="text"
                                            onChange={handleChange} onBlur={handleBlur}
                                            error={(errors.email && touched.email) ? {
                                                content: errors.email,
                                                pointing: 'above'
                                            } : false} />
                                        <Form.Input fluid icon='lock' iconPosition='left'
                                            placeholder='Passwort' type='password'
                                            data-testid="password"
                                            name="password"
                                            onChange={handleChange} onBlur={handleBlur}
                                            error={(errors.password && touched.password) ? {
                                                content: errors.password,
                                                pointing: 'above'
                                            } : false} />
                                        <Button fluid size='large'
                                            style={{'marginTop': '10px', 'background': '#94618E', 'color': '#ffffff'}}
                                            type="submit">Einloggen</Button>
                                    </Segment>
                                </Form>
                                <Message>
                                    Neu bei uns? &nbsp; 
                                    <a style={{'cursor': 'pointer', 'color': '#94618E'}} onClick={() => this.props.handleUserManagement('signup')}>Registrieren</a>
                                </Message>
                            </Grid.Column>
                        </Grid>
                    )}
                </Formik>
            </Modal.Content> 
        )
    }
}

export default Login;