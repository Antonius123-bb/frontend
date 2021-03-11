import * as React from "react";
import {Icon, Button, Grid, Dimmer, Loader, Form, Message, Table} from "semantic-ui-react";
import { Formik } from "formik";
import * as Yup from 'yup';
import { USER_COOKIE_INFO } from "../../../../constants";
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
        if (this.mounted) { this.setState({currentlyLoading: true, isLoading: true})}

        //check cookie and set state
        const userDetails = await userService.getUserById(JSON.parse(localStorage.getItem(USER_COOKIE_INFO)).id);
        if (this.mounted){
            this.setState({
                userDetails: userDetails.data.data
            })
        }
        if (this.mounted) { this.setState({currentlyLoading: false, isLoading: false})}
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    //called after submitting form -> save data in backend
    saveContactData = async (values, formikBag) => {
        try {
            if(this.mounted){
                const userInfos = await userService.addAddressByUserId(
                    this.state.userDetails["id"],
                    values.vorname,
                    values.nachname,
                    values.straße,
                    values.hausnummer,
                    values.postleitzahl,
                    values.ort
                ) 
                this.getUserDetails();
                
                //modify cookie
                localStorage.setItem(USER_COOKIE_INFO, JSON.stringify(userInfos.data.data));
                
                if (this.mounted){
                    this.setState({addMode: false})
                }
                if(this.state.error != "") {
                    if(this.mounted) {
                        this.setState({
                            error: ""
                        })
                    }
                }
                formikBag.resetForm();
    
                if(this.props.closeContactDataModal != null && this.mounted) {
                    this.props.closeContactDataModal();
                }

            }
            
        } catch (e) {
            if(this.mounted) {
                this.setState({
                    error: e.response.data
                })
            }
        }
    }

    //called from render()-Methode
    renderAddContactData = () => {
        return (
            <Formik
                initialValues={{
                    vorname: this.state.userDetails["name"] != null ? this.state.userDetails["name"]: '',
                    nachname: this.state.userDetails["lastName"] != null ? this.state.userDetails["lastName"]: '',
                    straße: '',
                    hausnummer: '',
                    postleitzahl: '',
                    ort: ''
                }}                
                validationSchema= {Yup.object().shape({
                    vorname: Yup.string()
                        .required('Vorname ist erforderlich.'),
                    nachname: Yup.string()
                        .required('Nachname ist erforderlich.'),
                    straße: Yup.string()
                        .required('Straße ist erforderlich.'),
                    hausnummer: Yup.string('Falsche Hausnummer.')
                        .required('Hausnummer ist erforderlich.'),
                    postleitzahl: Yup.string().matches(/^[0-9]{5}$/, 'Die Postleitzahl muss aus genau 5 Zahlen bestehen.')
                        .required('Postleitzahl ist erforderlich.'),
                    ort: Yup.string()
                        .required('Ort ist erforderlich.'),
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
                                value={values.vorname} 
                                fluid 
                                label='Vorname' 
                                placeholder='Vorname' 
                                name='vorname'
                                type='string'
                                required
                                onChange={handleChange} 
                                onBlur={handleBlur}
                                error={(errors.vorname && touched.vorname) ? { content: errors.vorname, pointing: 'above' } : false}
                                />
                                <Form.Input 
                                value={values.nachname} 
                                fluid 
                                label='Nachname' 
                                placeholder='Nachname' 
                                name='nachname'
                                type='string'
                                required
                                onChange={handleChange} 
                                onBlur={handleBlur}
                                error={(errors.nachname && touched.nachname) ? { content: errors.nachname, pointing: 'above' } : false}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Input 
                                width={6} 
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
                                width={4} 
                                value={values.ort} 
                                required 
                                fluid 
                                type='string'
                                name='ort'
                                label='Ort' 
                                placeholder='Ort'
                                onChange={handleChange} 
                                onBlur={handleBlur}
                                error={(errors.ort && touched.ort) ? { content: errors.ort, pointing: 'above' } : false}
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
        try {
            await userService.deleteAddressById(this.state.userDetails["id"], adressId);
            this.getUserDetails();
        } catch (e){
            console.log(e)
        }
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

                {this.state.userDetails["addresses"] && this.state.userDetails["addresses"].length === 0 && !this.state.currentlyLoading && !this.state.addMode &&
                    <Message 
                    color='grey'
                    header='Aktuell sind keine Kontaktdaten hinterlegt.'
                    content='Fügen Sie Kontaktdaten hinzu, um ihren Kauf fortzusetzen.'
                    />
                }

                {this.state.userDetails["addresses"] && this.state.userDetails["addresses"].length != 0 && !this.state.addMode &&
                <Table selectable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={3}>Vorname</Table.HeaderCell>
                            <Table.HeaderCell width={3}>Nachname</Table.HeaderCell>
                            <Table.HeaderCell width={5}>Straße</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Hausnummer</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Postleitzahl</Table.HeaderCell>
                            <Table.HeaderCell width={1}></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                    {this.state.userDetails["addresses"].map((item, index) => (
                        <Table.Row key={index}>
                            <Table.Cell width={3}>{item['name']}</Table.Cell>
                            <Table.Cell width={3}>{item['lastName']}</Table.Cell>
                            <Table.Cell width={5}>{item['street']}</Table.Cell>
                            <Table.Cell width={2}>{item['number']}</Table.Cell>
                            <Table.Cell width={2}>{item['plz']}</Table.Cell>
                            <Table.Cell width={1}>{this.renderDeleteIcon(item['id'])}</Table.Cell>
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




