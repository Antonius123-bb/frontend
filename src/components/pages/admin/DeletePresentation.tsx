import * as React from "react";
import {Icon, Button, Grid, Dimmer, Loader, Form, Message, Segment} from "semantic-ui-react";
import { DateTimeInput } from "semantic-ui-calendar-react";
import orderService from "../../../services/orderService";
import movieService from "../../../services/movieService";
import presentationService from "../../../services/presentationService";
var m = require('moment');

interface deletePresentationState {
    isLoading: boolean,
    activeAdminMenuItem: string,
    presentationIDs: Array<{
        key: string,
        text: string,
        value: string
    }>,
    selectedPresentationID: string,
    error: string,
    successModal: boolean
}


class DeletePresentation extends React.Component<{}, deletePresentationState> {

    private mounted: boolean = false;

    constructor(props: any) {
        super(props);

        this.state = {
            isLoading: false,
            activeAdminMenuItem: 'orders',
            presentationIDs: [{
                key: null,
                text: null,
                value: null
            }],
            selectedPresentationID: null,
            error: "",
            successModal: false
        }
    }

    async componentDidMount() {
        this.mounted = true;
        this.getDropdownData();
    }

    getDropdownData = async () => {
        try {

            const allPresentations = await presentationService.getAllPresentations();
    
            const dropDownData = allPresentations.data.data.map(item => ({
                key: item._id,
                text: item._id,
                value: item._id
            }))

            if (this.mounted){
                this.setState({
                    presentationIDs: dropDownData
                })
            }
        }
        catch {
        }
    }


    componentWillUnmount() {
        this.mounted = false;
    }

    //deleting presentation with id that admin put in form
    deletePresentation = async () => {
        if (this.mounted) { this.setState({successModal: false}) }
        try {
            await presentationService.deletePresentationById(
                this.state.selectedPresentationID
            );

            this.getDropdownData();

            //if deleting was successfull -> Handle Messages and reset input fields
            if(this.mounted) {
                this.setState({
                    error: "",
                    successModal: true,
                    selectedPresentationID: null
                })
            }
        //if deleting was unsuccessfull
        } catch (e) {
            if(this.mounted) {
                this.setState({
                    error: e.response.data
                })
            }
        }
    }

    //render form to create presentation
    render() {
        return (
            <Form>
                <Dimmer active={this.state.isLoading} inverted>
                    <Loader inverted content='Lädt' />
                </Dimmer>
                <Grid columns={1}>
                    <Grid.Column>
                        <Form.Select 
                            value={this.state.selectedPresentationID}
                            options={this.state.presentationIDs}
                            fluid 
                            label='Präsentation auswählen' 
                            placeholder='Präsentation ID'
                            required
                            search
                            onChange={(e, {value}) => {this.setState({selectedPresentationID: value.toString()})}}
                            />
                        <Button onClick={() => this.deletePresentation()} color='red' icon labelPosition='left' basic type='submit' disabled={this.state.selectedPresentationID == null}>
                                <Icon name='trash'/>
                                Vorstellung löschen
                            </Button> 
                        {this.state.successModal &&
                            <Message 
                            positive 
                            style={{"marginTop": "20px"}} 
                            header="Erfolgreich."
                            content="Vorstellung wurde erfolgreich gelöscht."                             
                            />
                            }
                        
                            {this.state.error != "" &&
                            <Message 
                            negative
                            color='grey'
                            header='Fehler.'
                            content={this.state.error}
                            />
                        }     

                    </Grid.Column>
                </Grid>
            </Form>
        )
    }
}

export default DeletePresentation;