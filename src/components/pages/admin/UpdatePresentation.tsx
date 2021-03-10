import * as React from "react";
import {Icon, Button, Grid, Dimmer, Loader, Form, Message, Segment} from "semantic-ui-react";
import { DateTimeInput } from "semantic-ui-calendar-react";
import orderService from "../../../services/orderService";
import movieService from "../../../services/movieService";
import presentationService from "../../../services/presentationService";
var m = require('moment');

interface updatePresentationState {
    isLoading: boolean,
    activeAdminMenuItem: string,
    presentationStart: any,
    presentationEnd: any,
    movieId: string,
    roomId: string,
    basicPrice: number,
    presentationIDs: Array<{
        key: string,
        text: string,
        value: string
    }>,
    selectedPresentationID: string,
    rooms: Array<{
        key: string,
        text: string,
        value: string
    }>,
    movies: Array<{
        key: string,
        text: string,
        value: string
    }>,
    error: string,
    successModal: boolean
}

const roomData = [
    {
        'roomId': '6043c266646e955a2881300e',
        "name": "Saal 1"
    },
    {
        'roomId': '6043c5aed6915558208e0f36',
        "name": "Saal 2"
    }
];

class UpdatePresentation extends React.Component<{}, updatePresentationState> {

    private mounted: boolean = false;

    constructor(props: any) {
        super(props);

        this.state = {
            isLoading: false,
            activeAdminMenuItem: 'orders',
            presentationStart: '',
            presentationEnd: '',
            movieId: null,
            roomId: null,
            basicPrice: 0,
            presentationIDs: [{
                key: null,
                text: null,
                value: null
            }],
            selectedPresentationID: null,
            rooms: [{
                key: null,
                text: null,
                value: null
            }],
            movies: [{
                key: null,
                text: null,
                value: null
            }],
            error: "",
            successModal: false
        }
    }

    async componentDidMount() {
        this.mounted = true;
        try {

            const movies = await movieService.getAllMovies();
            let movieArr = [];

            const allPresentations = await presentationService.getAllPresentations();
            console.log("ALL ", allPresentations)
    
            const dropDownData = allPresentations.data.data.map(item => ({
                key: item._id,
                text: item._id,
                value: item._id
            }))

            movies.data.data.forEach(mov => {
                let movieName = mov.originalTitle;
                if(mov.originalTitle === ""){
                    movieName = mov.title
                }
                const obj = {
                    key: mov._id.toString(),
                    text: movieName,
                    value: mov._id.toString()
                };
    
                movieArr.push(obj);
            })

            const roomArr = roomData.map(item => ({
                key: item.roomId,
                text: item.name,
                value: item.roomId
            }))

            if (this.mounted){
                this.setState({
                    movies: movieArr,
                    rooms: roomArr,
                    presentationIDs: dropDownData
                })
            }

        }
        catch {

        }

    }

    async componentDidUpdate(prevProps, prevState) {
        if(prevState.selectedPresentationID != this.state.selectedPresentationID) {
            if (this.mounted){
                const presentationData = await presentationService.getPresentationById(this.state.selectedPresentationID);
                console.log("PRE ", presentationData)
                //missing basicprice and roomid
                this.setState({
                    movieId: presentationData.data.data.movieId,
                    presentationStart: presentationData.data.data.presentationStart,
                    presentationEnd: presentationData.data.data.presentationEnd,
                    selectedPresentationID: presentationData.data.data._id
                })
            }
        }
    }


    componentWillUnmount() {
        this.mounted = false;
    }

    //update presentation with data that admin put in form
    updatePresentation = async () => {
        if (this.mounted) { this.setState({successModal: false}) }
        try {
            await presentationService.updatePresentationById(
                this.state.selectedPresentationID,
                this.state.presentationStart,
                this.state.presentationEnd,
                this.state.movieId,
                this.state.roomId,
                this.state.basicPrice
            );

            //if update was successfull -> Handle Messages and reset input fields
            if(this.mounted) {
                this.setState({
                    error: "",
                    successModal: true,
                    movieId: '',
                    roomId: '',
                    basicPrice: 0,
                    presentationStart: '',
                    presentationEnd: '',
                    selectedPresentationID: null
                })
            }
        //if creating was unsuccessfull
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
                        {this.state.selectedPresentationID != null &&
                        <Form.Group widths='equal'>
                            <Form.Select 
                            value={this.state.movieId}
                            options={this.state.movies}
                            fluid 
                            label='Film auswählen' 
                            placeholder='Film'
                            required
                            onChange={(e, {value}) => {this.setState({movieId: value.toString()})}}
                            />
                            <Form.Select 
                            value={this.state.roomId}
                            options={this.state.rooms}
                            fluid 
                            label='Saal auswählen' 
                            placeholder='Saal'
                            required
                            onChange={(e, {value}) => {this.setState({roomId: value.toString()})}}
                            />
                            <Form.Input
                            value={this.state.basicPrice}
                            required
                            fluid
                            name='basicPrice'
                            label='Basis Preis'
                            type='number'
                            placeholder='Basis Preis'
                            onChange={(e, {value}) => {this.setState({basicPrice: parseInt(value)})}}
                            />
                        </Form.Group>
                        }

                        {this.state.selectedPresentationID != null &&
                        <Grid.Row> 
                                <DateTimeInput     
                                    style={{'width': '32.6%'}}
                                    dateTimeFormat="yyyy-MM-DD HH:mm"                                                               
                                    animation={null}            
                                    placeholder="Vorstellungsbeginn"
                                    value={this.state.presentationStart}
                                    onChange={(e, {value}) => {this.setState({ presentationStart: value})}}
                                    iconPosition="left"
                                    minDate={new Date()}
                                    clearable
                                /> 
                                <DateTimeInput     
                                    style={{'width': '32.6%'}}
                                    dateTimeFormat="yyyy-MM-DD HH:mm"                                                               
                                    animation={null}            
                                    placeholder="Vorstellungsende"
                                    value={this.state.presentationEnd}
                                    onChange={(e, {value}) => {this.setState({ presentationEnd: value})}}
                                    iconPosition="left"
                                    minDate={new Date()}
                                    clearable
                                    />                             
                                <Button onClick={() => this.updatePresentation()} color='green' icon labelPosition='left' basic type='submit'
                                    disabled={
                                        this.state.presentationStart === '' ||
                                        this.state.presentationEnd === '' ||
                                        this.state.movieId == null ||
                                        this.state.selectedPresentationID == null ||
                                        this.state.roomId == null ||
                                        this.state.basicPrice <= 0 }>

                                    <Icon name='edit'/>
                                    Änderungen speichern
                                </Button>    
                                {this.state.successModal &&
                                <Message 
                                positive 
                                style={{"marginTop": "20px"}} 
                                header="Erfolgreich."
                                content="Vorstellung wurde erfolgreich bearbeitet."                             
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
                        </Grid.Row>
                        }

                    </Grid.Column>
                </Grid>
            </Form>
        )
    }
}

export default UpdatePresentation;