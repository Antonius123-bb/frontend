import * as React from "react";
import {Icon, Button, Grid, Dimmer, Loader, Form, Message, Table} from "semantic-ui-react";
import { Formik } from "formik";
import * as Yup from 'yup';
import { ALL_ADDRESSES, USER_COOKIE_INFO } from "../../../../constants";
import userService from "../../../../services/userService";

//The Contact Data Container to add adresses

interface contactDataState {
    isLoading: boolean,
    userDetails: Array<{}>,
    addMode: boolean,
    currentlyLoading: boolean,
    name: string,
    error: string
}

class ContactData extends React.Component<{closeContactDataModal: any}, contactDataState> {

    private mounted: boolean = false;

    constructor(props: any) {
        super(props);

        this.state = {
            isLoading: false,
            userDetails: [],
            addMode: false,
            currentlyLoading: false,
            name: null,
            error: ""
        }
    }

    async componentDidMount() {
        this.mounted = true;
        //get user details directly after component mounts
        this.getUserDetails();
    }

    // get user details
    getUserDetails = async () => {
        if (this.mounted) { this.setState({currentlyLoading: true})}

        //check cookie and set state
        const userDetails = await userService.getUserById(JSON.parse(localStorage.getItem(USER_COOKIE_INFO)).id);
        if (this.mounted){
            this.setState({
                userDetails: userDetails.adresses,
                name: userDetails.name + " " + userDetails.lastName
            })
        }
        if (this.mounted) { this.setState({currentlyLoading: false})}
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    //called after submitting form -> save data in backend
    saveContactData = async (values, formikBag) => {

        // //check if user filled in a phone number, if not: send data without 
        // if (values.telefonnummer && values.telefonnummer !== ''){

        //     //modify attributes before sending to backend
        //     const straße = values.straße + " " + values.hausnummer;
        //     const telefonnummer = values.präfix + values.telefonnummer;
        //     try {
        //          await userService.addAdress(
        //             values.anrede,
        //             values.name,
        //             straße,
        //             values.postleitzahl.toString(),
        //             values.stadt,
        //             telefonnummer
        //         ) 
        //         this.getUserDetails();
                
        //         //modify cookie
        //         const adresses = await userService.getUserinfos();
        //         localStorage.setItem(ALL_ADDRESSES, JSON.stringify(adresses.data.adressen));
                
        //         if (this.mounted){
        //             this.setState({addMode: false})
        //         }
        //         if(this.state.error != "") {
        //             if(this.mounted) {
        //                 this.setState({
        //                     error: ""
        //                 })
        //             }
        //         }
        //         formikBag.resetForm();

        //         if(this.props.closeContactDataModal != null) {
        //             this.props.closeContactDataModal();
        //         }
                
        //     } catch (e) {
        //         if(this.mounted) {
        //             this.setState({
        //                 error: e.response.data
        //             })
        //         }
        //     }
        // } else {
        //     //user filled in a phone number, send data with phone number
        //     const straße = values.straße + values.hausnummer;
        //     try {
        //         await userService.addAdress(
        //             values.anrede,
        //             values.name,
        //             straße,
        //             values.postleitzahl.toString(),
        //             values.stadt,
        //             ''
        //         )
        //         this.getUserDetails();
        //         if (this.mounted){
        //             this.setState({addMode: false})
        //         }
        //         if(this.state.error != "") {
        //             if(this.mounted) {
        //                 this.setState({
        //                     error: ""
        //                 })
        //             }
        //         }
        //         formikBag.resetForm();

        //         if(this.props.closeContactDataModal != null) {
        //             this.props.closeContactDataModal();
        //         }

        //     } catch (e) {
        //         if(this.mounted) {
        //             this.setState({
        //                 error: e.response.data
        //             })
        //         }
        //     }
        // }

    }

    //called from render()-Methode
    renderAddContactData = () => {
        return (
            <Formik
                initialValues={{
                    name: this.state.name != null ? this.state.name: '',
                    straße: '',
                    anrede: '',
                    hausnummer: '',
                    postleitzahl: '',
                    stadt: '',
                    präfix: '+49',
                    telefonnummer: ''
                }}                
                validationSchema= {Yup.object().shape({
                    name: Yup.string()
                        .required('Name ist erforderlich.'),
                    anrede: Yup.string()
                        .required('Anrede ist erforderlich.'),
                    straße: Yup.string()
                        .required('Straße ist erforderlich.'),
                    hausnummer: Yup.string('Falsche Hausnummer.')
                        .required('Hausnummer ist erforderlich.'),
                    postleitzahl: Yup.string().matches(/^[0-9]{5}$/, 'Die Postleitzahl muss aus genau 5 Zahlen bestehen.')
                        .required('Postleitzahl ist erforderlich.'),
                    stadt: Yup.string()
                        .required('Stadt ist erforderlich.'),
                    präfix: Yup.string(),
                    telefonnummer: Yup.number('Falsche Telefonnummer.')
                })}
                onSubmit={this.saveContactData}
                enableReinitialize
            >
                {({ errors, touched, handleChange, handleBlur, handleSubmit, values }) => (
                    <Form onSubmit={handleSubmit}>
                        <Dimmer active={this.state.isLoading} inverted>
                            <Loader inverted content='Lädt' />
                        </Dimmer>
                        <Grid columns={1}>
                            <Grid.Column>
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
                                type='string'
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
                                width={13}
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
                            </Form.Group>
                            <Grid.Row>
                                
                                <Button color='red' basic icon labelPosition='left' onClick={() => this.setState({addMode: false})}>
                                    Zurück
                                    <Icon name='backward'/>
                                </Button>      
                                <Button color='green' icon labelPosition='left' basic floated='right' type='submit'>
                                    <Icon name='save'/>
                                    Speichern
                                </Button>                                       
                            </Grid.Row>

                            </Grid.Column>
                        </Grid>
                        {this.state.error != "" &&
                            <Message 
                            color='grey'
                            header='Fehler.'
                            content={this.state.error}
                            />
                        }
                    </Form>
                )}
            </Formik>
        )
    }

    //function to delete the adress that is connected with the ID parameter
    deleteAdress = async (adressId) => {
        // await userService.deleteAddress(adressId);
        // this.getUserDetails();
        
        // //modify cookie
        // const adresses = await userService.getUserinfos();
        // localStorage.setItem(ALL_ADDRESSES, JSON.stringify(adresses.data.adressen));
    } 

    //called from every single table row
    renderDeleteIcon = (adressId) => {
        return (
            <Icon
            style={{'cursor': 'pointer'}}
            name='trash'
            onClick={() => this.deleteAdress(adressId)}
            />
        )
    }

    render() {
        return (
            <React.Fragment>
                {!this.state.addMode &&
                <Button
                icon
                color='green'
                onClick={() => this.setState({addMode: true})}
                labelPosition='left'
                >
                Kontaktdaten hinzufügen
                    <Icon name='plus'/>
                </Button>
                } 

                {!this.state.addMode && !this.state.userDetails && !this.state.currentlyLoading &&
                    <Message 
                    color='grey'
                    header='Aktuell sind keine Kontaktdaten hinterlegt.'
                    content='Fügen Sie Kontaktdaten hinzu, um ihren Kauf fortzusetzen.'
                    />
                }

                {this.state.userDetails && this.state.userDetails.length != 0 && !this.state.addMode &&
                <Table selectable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={2}>Anrede</Table.HeaderCell>
                            <Table.HeaderCell width={3}>Name</Table.HeaderCell>
                            <Table.HeaderCell width={5}>Straße</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Postleitzahl</Table.HeaderCell>
                            <Table.HeaderCell width={1}></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                    {this.state.userDetails.map((item, index) => (
                        <Table.Row key={index}>
                            <Table.Cell width={2}>{item['anrede']}</Table.Cell>
                            <Table.Cell width={3}>{item['name']}</Table.Cell>
                            <Table.Cell width={5}>{item['strasse']}</Table.Cell>
                            <Table.Cell width={2}>{item['plz']}</Table.Cell>
                            <Table.Cell width={1}>{this.renderDeleteIcon(item['adressenid'])}</Table.Cell>
                        </Table.Row>
                    ))}
                    </Table.Body>
                </Table>
                }                
                {this.state.addMode &&
                    this.renderAddContactData()
                }
            </React.Fragment>
        )
    }
}

export default ContactData;




