import * as React from "react";
import {Icon, Button, Grid, Segment, Form, Message, Header} from "semantic-ui-react";
import { Formik } from "formik";
import * as Yup from 'yup';
import userService from "../../../services/userService";
import AdminDetails from "./AdminDetails";
import { USER_COOKIE_INFO } from "../../../constants";

//The Admin overview to handle login of a admin and to send unauthorized users away

interface adminOverviewState {
    isLoading: boolean,
    userLoggedIn: boolean,
    userIsAdmin: boolean
}

class AdminOverview extends React.Component<{history: any}, adminOverviewState> {

    private mounted: boolean = false;

    constructor(props: any) {
        super(props);

        this.state = {
            isLoading: false,
            userLoggedIn: false,
            userIsAdmin: true
        }
    }

    async componentDidMount() {
        this.mounted = true;
        //when component is mounted: Check user rights
        this.handleUserRights();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    //function to handle information about user: is user admin, is user logged in
    handleUserRights = async () => {
        if (this.mounted){
            this.setState({isLoading: true})
        }
        try {
            const userDetails = await userService.getUserById(JSON.parse(localStorage.getItem(USER_COOKIE_INFO)).id);
            console.log("userDetails ", userDetails)

            // User logged in
            if (this.mounted && localStorage.getItem(USER_COOKIE_INFO)){
                this.setState({userLoggedIn: true})
            }

            // to be changed
            if (true){
                // user is admin
                if (this.mounted) {
                    this.setState({userIsAdmin: true})
                }
            } else {
                //When logged in user is no admin, push to home page
                this.props.history.push('/')
            }
        }
        catch (e){
            console.log("error ", e)
        }
        if (this.mounted){
            this.setState({isLoading: false})
            console.log("ADMIN/Logged " + this.state.userIsAdmin + this.state.userLoggedIn)
        }
    }

    // function that is called after pressing Login Button
    submitLogin = async (values, formikBag) => {
        if (this.mounted){ formikBag.setSubmitting(true) }        
        try {
            //login with data that user filled in
            const response = await userService.validateUser(values.password, values.email);
            
            if(response.status === 200) {
                //login was successfull, so handle user rights again
                this.handleUserRights();

                //update cookie
                localStorage.setItem(USER_COOKIE_INFO, JSON.stringify(response.data.data));

                // const userinfo = await userService.getUserById(JSON.parse(USER_COOKIE_INFO).id);
                // if (adresses.data.adresses && adresses.data.adresses != null){
                //     localStorage.setItem(ALL_ADDRESSES, JSON.stringify(adresses.data.adressen));
                // }

            }

            if (this.mounted){ formikBag.setSubmitting(false) } 
        } catch(error) {
            //handle errors received from backend
            // if (error.response.status === 409){
            //     if (this.mounted){
            //         formikBag.setErrors({
            //             email: "Das angegebene Konto scheint nicht zu existieren."
            //         })
            //     }
            // } if (error.response.status === 423){
            //     if (this.mounted){
            //         formikBag.setErrors({
            //             email: "Das angegebene Konto wurde deaktiviert."
            //         })
            //     }
            // } else if (error.response.status === 403 || error.response.status === 401){
            //     if (this.mounted){
            //         formikBag.setErrors({
            //             email: "Email und Passwort stimmen nicht überein.",
            //             password: "Email und Passwort stimmen nicht überein."
            //         })
            //     }
            // }
            // if (this.mounted){ formikBag.setSubmitting(false) } 
            console.log("error ", error)
        }
    }

    //function that is called directly from render function and returns the standard login form
    renderLoginForm = () => {
        return (
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
                                <Message color='grey'
                                    attached>Melden Sie sich mit ihren Zugangsdaten an.</Message>
                                <Form onSubmit={handleSubmit}>
                                    <Segment stacked>
                                        <Form.Input fluid icon="at" iconPosition="left"
                                            placeholder='Email'
                                            name="email" type="text"
                                            onChange={handleChange} onBlur={handleBlur}
                                            error={(errors.email && touched.email) ? {
                                                content: errors.email,
                                                pointing: 'above'
                                            } : false} />
                                        <Form.Input fluid icon='lock' iconPosition='left'
                                            placeholder='Passwort' type='password'
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
                            </Grid.Column>
                        </Grid>
                    )}
                </Formik>
        )
    }


    render() {

        return (
            <Grid> 
                <Segment style={{'background': '#94618E', 'borderRadius': 0, 'height': '80px', 'width': '100%', 'textAlign': 'center'}}>
                    <Header as="h2" style={{'paddingTop': '20px', 'color': 'rgb(244, 222, 203)'}}>Admin Bereich</Header>
                </Segment>
                <Grid.Row columns={3} style={{'marginTop': '50px'}}>
                    <Grid.Column width={1}></Grid.Column>
                    <Grid.Column width={14}>
                        {!this.state.userLoggedIn && !this.state.isLoading &&
                        //user not logged in
                        <React.Fragment>
                            <Message info compact icon>
                                <Icon name='info'/>
                                <Message.Header style={{'width': '80%'}}>
                                    Sie sind derzeit nicht eingeloggt.
                                </Message.Header>                           
                            </Message>  
                            {this.renderLoginForm()}

                        </React.Fragment>
                        }
                        {this.state.userLoggedIn && this.state.userIsAdmin && !this.state.isLoading &&
                        //user logged in, and admin
                        <React.Fragment>
                            <Header as="h3">Markieren Sie Bestellungen als bezahlt oder fügen Sie neue Vorstellungen hinzu.</Header>
                            <AdminDetails/>
                        </React.Fragment>
                        }
                    </Grid.Column>
                    <Grid.Column width={1}></Grid.Column>
                </Grid.Row>               
            </Grid>
        )
    }
}

export default AdminOverview;