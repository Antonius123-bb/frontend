import * as React from "react";
import TopMenu from "../../menus/public/TopMenu";
import { Grid, Button, Modal, Accordion, Icon, Form, Dimmer, Loader, Header, Divider, Message } from "semantic-ui-react";
import { USER_COOKIE_NAME, CART_COOKIE } from "../../../constants";
import userService from "../../../services/userService";
import Login from "./Login";
import Signup from "./Signup";
import DefaultModal from "./DefaultModal";
import { Formik } from "formik";
import * as Yup from 'yup';
import Paypal from "../../container/Paypal";
import ContactData from "../private/Profile/ContactData";
import presentationsService from "../../../services/presentationService";

//Todo show result thank you page, etc


class Checkout extends React.Component<{location: any, history: any}, {error: string, openContactDataModal: boolean, updated: boolean, selectedAdress: number, adressen: any, loading: boolean, user: any, openModal: boolean, activePage: string, activated: boolean, buyAsGuest: boolean, paymentMethode: string, selectedSeats: Array<number>, cost: number, costList: any, movieName: string}> {
    
    private mounted: boolean = false;

    constructor(props: any) {
        super(props);

        this.state = {
            openContactDataModal: false,
            updated: false,
            selectedAdress: 0,
            adressen: [],
            loading: false,
            user: null,
            openModal: false,
            activePage: 'login',
            activated: false,
            buyAsGuest: false,
            paymentMethode: 'Bar',
            selectedSeats: [],
            cost: 0,
            costList: null,
            movieName: null,
            error: ""
        };

    }

    async componentDidMount() {
        this.mounted = true;

        window.scrollTo(0, 0);

        if(this.mounted) {
            this.setState({
                loading: true
            })
        }

        const user = localStorage.getItem(USER_COOKIE_NAME);
        console.log("TEST ", USER_COOKIE_NAME)

        if(user != null) {
            const userData = await userService.getUserById(2);

            if(this.mounted) {
                this.setState({
                    user: userData.data,
                    adressen: userData.data.adressen
                })
            }
        }

        //to avoid unautorized checkout calls
        if(this.props.location.state != undefined) {

            const selectedSeats = this.props.location.state.selectedSeats;
            const cost = this.props.location.state.cost;
            const costList = this.props.location.state.costList;
            const movieName = this.props.location.state.movieName;

            if(this.mounted) {
                this.setState({
                    selectedSeats: selectedSeats,
                    cost: cost,
                    costList: costList,
                    movieName: movieName
                })
            }
        } else {
            this.props.history.push('/');
        }

        this.wait(1000);

        if(this.mounted) {
            this.setState({
                loading: false
            })
        }
    }

    wait = (ms) => {
        var start = new Date().getTime();
        var end = start;
        while(end < start + ms) {
          end = new Date().getTime();
       }
     }

    async componentDidUpdate(prevProps) {
        if(prevProps != this.props) {
            //to avoid unautorized checkout calls
            if(this.props.location.state != undefined) {

                const selectedSeats = this.props.location.state.selectedSeats;
                const cost = this.props.location.state.cost;
                const costList = this.props.location.state.costList;
                const movieName = this.props.location.state.movieName;

                if(prevProps != this.props) {
                    if(this.mounted) {
                        this.setState({
                            selectedSeats: selectedSeats,
                            cost: cost,
                            costList: costList,
                            movieName: movieName
                        })
                    }
                }
            } else {
                this.props.history.push('/');
            }
        }

        if(!this.state.updated) {
            //update user after forceUpdate() after login
            const user = localStorage.getItem(USER_COOKIE_NAME);
            if(user != null) {
                const userDetails = await userService.getUserinfos();

                if(this.mounted) {
                    this.setState({
                        updated: true
                    })
                }

                if(userDetails.data.adressen) {
                    if(this.mounted) {
                        this.setState({
                            adressen: userDetails.data.adressen,
                        })
                    }
                }
            }
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    handleUserManagement = (pageName) => {
        if (this.mounted){
            this.setState({activePage: pageName, activated: false, openModal: true})
        }        
    };

    handleOpenModalState = async (boolean) => {
        const user = localStorage.getItem(USER_COOKIE_NAME);

        if(user != null) {
            const userData = await userService.getUserinfos();

            if(this.mounted) {
                this.setState({
                    user: userData.data
                })
            }
        }

        if (this.mounted){
            this.setState({openModal: boolean})
        }
    }

    buy = async (values, formikBag) => {

        if(values === "") {

            const rechnung = {
                titel: this.state.user.adressen[this.state.selectedAdress].anrede,
                name: this.state.user.name,
                strasse: this.state.user.adressen[this.state.selectedAdress].strasse + " " + this.state.user.adressen[this.state.selectedAdress].hausnummer,
                plz: this.state.user.adressen[this.state.selectedAdress].plz,
                stadt: this.state.user.adressen[this.state.selectedAdress].stadt
            };
    
            const response = await presentationsService.placeOrder(parseInt(this.props.location.state.presentationId), this.state.user.email, this.state.selectedSeats, 0, rechnung);
        
            if(response.status === 200) {
                this.props.history.push("/thankyou");
                localStorage.removeItem(CART_COOKIE);

                if(this.state.error != "" && this.mounted) {
                    this.setState({
                        error: ""
                    })
                }
            } else {
                if(this.mounted) {
                    this.setState({
                        error: response.data
                    })
                }
            }
        } else {
            const rechnung = {
                titel: values.anrede,
                name: values.name,
                strasse: values.straße + " " + values.hausnummer,
                plz: values.postleitzahl.toString(),
                stadt: values.stadt,
                telefon: values.präfix + values.telefonnummer
            };
    
            const response = await presentationsService.placeOrder(parseInt(this.props.location.state.presentationId), values.email, this.state.selectedSeats, 0, rechnung);

            if(response.status === 200) {
                this.props.history.push("/thankyou");
                localStorage.removeItem(CART_COOKIE);
            } else {
                if(this.state.error != "" && this.mounted) {
                    this.setState({
                        error: ""
                    })
                }
            }
        };
    }

    render() {

        const { activePage, activated } = this.state

        return (
            <React.Fragment>

                <TopMenu refreshCart={/*this.state.refreshCart*/0} history={this.props.history} />

                    {this.state.user === null && !this.state.buyAsGuest &&
                    <Grid centered style={{'marginLeft':'10px', 'marginRight':'10px'}}>
                        <Dimmer active={this.state.loading}>
                            <Loader />
                        </Dimmer>
                        <Grid.Row>
                            <Header style={{'fontSize': '30px'}} as="h3">
                                Wie möchten Sie fortfahren?
                            </Header>
                        </Grid.Row>
                        <Grid.Row columns="2" centered>
                            <Grid.Column width="6">
                                <Button style={{'width': '500px', 'height': '500px', 'fontSize': '30px', 'textAlign': 'center', 'color': 'rgb(148, 97, 142)'}} onClick={() => this.setState({openModal: true})}>
                                    Login<br/>
                                    <Icon style={{'marginTop': '50px', 'marginLeft': '50px'}} name="user circle" size="huge"/>
                                </Button>
                            </Grid.Column>
                            <Grid.Column width="6">
                                <Button style={{'width': '500px', 'height': '500px', 'fontSize': '30px', 'color': 'rgb(148, 97, 142)'}} onClick={() => this.setState({buyAsGuest: true})}>
                                    Als Gast kaufen<br/>
                                    <Icon style={{'marginTop': '50px', 'marginLeft': '40px'}} name="users" size="huge"/></Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>}

                    {this.state.user === null && this.state.buyAsGuest &&
                    
                    <React.Fragment>

                        <Formik
                            initialValues={{
                                name: '',
                                straße: '',
                                anrede: '',
                                hausnummer: '',
                                postleitzahl: '',
                                stadt: '',
                                präfix: '+49',
                                telefonnummer: '',
                                email: ''
                            }}                
                            validationSchema= {Yup.object().shape({
                                name: Yup.string()
                                    .required('Name ist erforderlich.'),
                                anrede: Yup.string()
                                    .required('Anrede ist erforderlich.'),
                                straße: Yup.string()
                                    .required('Straße ist erforderlich.'),
                                hausnummer: Yup.number('Falsche Hausnummer.')
                                    .required('Hausnummer ist erforderlich.'),
                                postleitzahl: Yup.number()
                                    .required('Postleitzahl ist erforderlich.')
                                    .min(5, 'Postleitzahl muss aus mindestens 5 Zahlen bestehen.'),
                                stadt: Yup.string()
                                    .required('Stadt ist erforderlich.'),
                                präfix: Yup.string(),
                                telefonnummer: Yup.number('Falsche Telefonnummer.'),
                                email: Yup.string()
                                    .required('Email ist erforderlich.')
                                    .email('Email ist nicht korrekt.'),

                            })}
                            onSubmit={this.buy}
                            enableReinitialize
                        >
                            {({ errors, touched, handleChange, handleBlur, handleSubmit, values }) => (
                                <Form onSubmit={handleSubmit}>
                                    <Grid centered style={{'marginLeft':'10px', 'marginRight':'10px'}}>
                                        <Grid.Row>
                                            <Header as="h3">
                                                Bitte füllen Sie das Formular aus um den Kauf abzuschließen.
                                            </Header>
                                        </Grid.Row>
                                        <Grid.Column width="12">
                                            <Form.Group widths='equal'>
                                                <Form.Input 
                                                value={values.name} 
                                                fluid 
                                                label='Vollständiger Name' 
                                                placeholder='Name' 
                                                name='name'
                                                type='string'
                                                required
                                                onChange={handleChange} 
                                                onBlur={handleBlur}
                                                error={(errors.name && touched.name) ? { content: errors.name, pointing: 'above' } : false}
                                                />
                                                <Form.Input
                                                value={values.anrede}
                                                required
                                                fluid
                                                name='anrede'
                                                label='Anrede'
                                                type='string'
                                                placeholder='Anrede'
                                                onChange={handleChange} 
                                                onBlur={handleBlur}
                                                error={(errors.anrede && touched.anrede) ? { content: errors.anrede, pointing: 'above' } : false}
                                                />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Input 
                                                width={5} 
                                                value={values.straße} 
                                                required 
                                                name='straße'
                                                fluid 
                                                type='string'
                                                label='Straße' 
                                                placeholder='Straße'
                                                onChange={handleChange} 
                                                onBlur={handleBlur}
                                                error={(errors.straße && touched.straße) ? { content: errors.straße, pointing: 'above' } : false}
                                                />
                                                <Form.Input 
                                                width={2} 
                                                value={values.hausnummer} 
                                                required 
                                                fluid 
                                                name='hausnummer'
                                                type='number'
                                                label='Hausnummer' 
                                                placeholder='Hausnummer'
                                                onChange={handleChange} 
                                                onBlur={handleBlur}
                                                error={(errors.hausnummer && touched.hausnummer) ? { content: errors.hausnummer, pointing: 'above' } : false}
                                                />
                                                <Form.Input 
                                                width={4} 
                                                value={values.postleitzahl} 
                                                required 
                                                fluid 
                                                type='number'
                                                name='postleitzahl'
                                                label='Postleitzahl' 
                                                placeholder='Postleitzahl'
                                                onChange={handleChange} 
                                                onBlur={handleBlur}
                                                error={(errors.postleitzahl && touched.postleitzahl) ? { content: errors.postleitzahl, pointing: 'above' } : false}
                                                />
                                                <Form.Input 
                                                width={5} 
                                                value={values.stadt}
                                                required 
                                                fluid 
                                                name='stadt'
                                                type='string'
                                                label='Stadt' 
                                                placeholder='Stadt' 
                                                onChange={handleChange} 
                                                onBlur={handleBlur}
                                                error={(errors.stadt && touched.stadt) ? { content: errors.stadt, pointing: 'above' } : false}
                                                />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Input 
                                                value={values.präfix}
                                                width={3}
                                                name='präfix'
                                                fluid
                                                type='string'
                                                label='Präfix'
                                                placeholder='+49'
                                                onChange={handleChange} 
                                                onBlur={handleBlur}
                                                error={(errors.präfix && touched.präfix) ? { content: errors.präfix, pointing: 'above' } : false}
                                                />
                                                <Form.Input 
                                                value={values.telefonnummer}
                                                width={6}
                                                fluid 
                                                name='telefonnummer'
                                                placeholder='Telefonnummer' 
                                                label='Telefonnummer'
                                                type='string'
                                                labelPosition='left'
                                                onChange={handleChange} 
                                                onBlur={handleBlur}
                                                error={(errors.telefonnummer && touched.telefonnummer) ? { content: errors.telefonnummer, pointing: 'above' } : false}
                                                />
                                                 <Form.Input 
                                                value={values.email}
                                                width={7}
                                                fluid 
                                                name='email'
                                                placeholder='@' 
                                                label='Email'
                                                type='string'
                                                labelPosition='left'
                                                onChange={handleChange} 
                                                onBlur={handleBlur}
                                                error={(errors.email && touched.email) ? { content: errors.email, pointing: 'above' } : false}
                                                />
                                            </Form.Group>
                                        </Grid.Column>
                                        <Grid.Row columns="2">
                                            <Grid.Column width="6">
                                                <div style={{'marginLeft': '20px'}}>
                                                    <Header style={{'color': 'rgb(148, 97, 142)', 'fontSize': '26px'}} as="h3">
                                                        Ihre Bestellung:
                                                    </Header>
                                                
                                                    <h3>{this.state.movieName}</h3>

                                                    {this.state.costList != null && this.state.costList.map((pos, pIndex) => {
                                                        return (
                                                            <p key={pIndex}>{pos['category']} * {pos['times']} = {pos['cost']}€</p>
                                                        )
                                                    })}

                                                    <b><p style={{'fontSize': '20px'}}>Gesamtpreis: {this.state.cost}€ inkl. MwSt.</p></b>
                                                </div>
                                            </Grid.Column>

                                            <Grid.Column width="6">
                                                <Header style={{'color': 'rgb(148, 97, 142)'}} as="h4">
                                                    Bezahlung wählen.
                                                </Header>
                                                <Accordion styled>
                                                    <Accordion.Title
                                                    active={this.state.paymentMethode === 'Bar'}
                                                    index={0}
                                                    onClick={() => this.setState({paymentMethode: 'Bar'})}
                                                    >
                                                    <Icon name={this.state.paymentMethode === 'Bar' ? 'circle' : 'circle outline'} />
                                                    Barzahlung
                                                    </Accordion.Title>
                                                    <Accordion.Content active={this.state.paymentMethode === 'Bar'}>
                                                    <p>
                                                        Sie können Ihre Tickets bei uns abholen und bar bezahlen.
                                                    </p>
                                                    </Accordion.Content>
                                                </Accordion>
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row columns="2">
                                            <Grid.Column width="7">

                                            </Grid.Column>
                                            <Grid.Column width="4">
                                            
                                                <Button type='submit' disabled={this.state.adressen == undefined} floated="right">Kostenpflichtig kaufen</Button>
                                            
                                            </Grid.Column>

                                        </Grid.Row>
                                    </Grid>
                                </Form>
                            )}
                        </Formik>

                        <Divider />
                    </React.Fragment>}

                    {this.state.user != null && !this.state.buyAsGuest && 
                    <Grid centered style={{'marginLeft':'10px', 'marginRight':'10px'}}>
                        <Grid.Row columns="2">
                            <Grid.Column width="6">
                                <Header as="h3">
                                    Bitte füllen Sie das Formular aus um den Kauf abzuschließen.
                                </Header>

                                <Button positive onClick={() => this.setState({openContactDataModal: true})}>
                                    Adresse hinzufügen
                                </Button>
                            </Grid.Column>

                            <Grid.Column width="6">
                                <Header style={{'color': 'rgb(148, 97, 142)'}} as="h4">
                                    Adresse auswählen.
                                </Header>
                                <Accordion styled>
                                    {this.state.adressen == undefined &&
                                    <Message color='red'>Bitte fügen Sie eine Adresse hinzu!.</Message>
                                    }
                                    {this.state.adressen && this.state.adressen.map((item, index) => {
                                        return(
                                            <React.Fragment key={index}>                                     
                                                <Accordion.Title
                                                active={this.state.selectedAdress === index}
                                                index={0}
                                                onClick={() => this.setState({selectedAdress: index})}
                                                >
                                                <Icon name={this.state.selectedAdress === index ? 'circle' : 'circle outline'} />
                                                {item.anrede} {item.name}, {item.strasse} ({item.plz})
                                                </Accordion.Title>
                                                <Accordion.Content active={this.state.selectedAdress === index}>
                                                <p>
                                                    Hierhin liefern.
                                                </p>
                                                </Accordion.Content>
                                            </React.Fragment>   
                                        )
                                    })}
                                </Accordion>
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row columns="2">
                            <Grid.Column width="6">
                                <Header style={{'color': 'rgb(148, 97, 142)', 'fontSize': '26px'}} as="h3">
                                    Ihre Bestellung:
                                </Header>
                                <h3>{this.state.movieName}</h3>

                                {this.state.costList != null && this.state.costList.map((pos, pIndex) => {
                                    return (
                                        <p key={pIndex}>{pos['category']} * {pos['times']} = {pos['cost']}€</p>
                                    )
                                })}

                                <b><p style={{'fontSize': '20px'}}>Gesamtpreis: {this.state.cost}€ inkl. MwSt.</p></b>
                            </Grid.Column>

                            <Grid.Column width="6">
                                <Header style={{'color': 'rgb(148, 97, 142)'}} as="h4">
                                    Bezahlung wählen.
                                </Header>
                                <Accordion styled>
                                    <Accordion.Title
                                    active={this.state.paymentMethode === 'Bar'}
                                    index={0}
                                    onClick={() => this.setState({paymentMethode: 'Bar'})}
                                    >
                                    <Icon name={this.state.paymentMethode === 'Bar' ? 'circle' : 'circle outline'} />
                                    Barzahlung
                                    </Accordion.Title>
                                    <Accordion.Content active={this.state.paymentMethode === 'Bar'}>
                                    <p>
                                        Sie können Ihre Tickets bei uns abholen und bar bezahlen.
                                    </p>
                                    </Accordion.Content>

                                    <Accordion.Title
                                    active={this.state.paymentMethode === 'Paypal'}
                                    index={2}
                                    onClick={() => this.setState({paymentMethode: 'Paypal'})}
                                    >
                                    <Icon name={this.state.paymentMethode === 'Paypal' ? 'circle' : 'circle outline'} />
                                    Paypal
                                    </Accordion.Title>
                                    <Accordion.Content active={this.state.paymentMethode === 'Paypal'}>
                                    <p>
                                        Bezahlen Sie bequem per Paypal und wir senden Ihnen die Tickets per Email zu.
                                    </p>
                                    </Accordion.Content>
                                </Accordion>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns="2">
                                <Grid.Column width="7">

                                </Grid.Column>
                                <Grid.Column width="4">
                                {this.state.paymentMethode === 'Paypal' && this.state.adressen != undefined &&
                                    <Paypal history={this.props.history} selectedAdress={this.state.selectedAdress} selectedSeats={this.state.selectedSeats} user={this.state.user} presId={this.props.location.state.presentationId} totalCost={this.state.cost} desc={this.state.movieName} />
                                }
                                {this.state.paymentMethode === 'Bar' &&
                                    <Button onClick={() => this.buy("", "")} disabled={this.state.adressen == undefined} floated="right">Kostenpflichtig kaufen</Button>
                                }
                                </Grid.Column>

                            </Grid.Row>
                    </Grid>}

                <Modal
                    style={{ 'minHeight': '700px' }} 
                    open={this.state.openModal || activated}
                    onClose={() => this.setState({openModal: false, activated: false, activePage: 'login'}, () => history.pushState('', '', '/'))}
                    closeIcon
                >
                    {activePage === 'login' && !activated && 
                        <Login handleUserManagement={this.handleUserManagement} handleOpenModalState={this.handleOpenModalState}/>
                    }
                    {activePage === 'signup' && !activated &&  
                        <Signup handleUserManagement={this.handleUserManagement}/>
                    }
                    {activePage === 'checkEmail' && !activated &&  
                        <DefaultModal handleUserManagement={this.handleUserManagement} success={false} info={true} iconName='mail' description='Bitte durchsuchen Sie Ihr Email Postfach, um Ihren Account zu verifizieren.'/>
                    }
                    {activated &&
                        <DefaultModal handleUserManagement={this.handleUserManagement} success={true} info={false} iconName='check' description='Ihr Account wurde erfolgreich verifiziert. Sie können sich jetzt einloggen.'/>
                    }
                </Modal>

                <Modal
                    style={{ 'padding': '30px', 'width': '80%' }} 
                    open={this.state.openContactDataModal}
                    onClose={() => this.setState({openContactDataModal: false})}
                    closeIcon
                >
                    <ContactData closeContactDataModal={() => {this.setState({openContactDataModal: false, updated: false}); this.forceUpdate()}}/>
                </Modal>

                {this.state.error != "" &&
                <Message
                    header="Fehler."
                    content={this.state.error}
                >
                </Message>
                }
            
            </React.Fragment>
        )
    }
}

export default Checkout;