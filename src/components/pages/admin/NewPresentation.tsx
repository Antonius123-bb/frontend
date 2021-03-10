import * as React from "react";
import {Icon, Button, Grid, Dimmer, Loader, Form, Message, Segment} from "semantic-ui-react";
import { DateTimeInput } from "semantic-ui-calendar-react";
import orderService from "../../../services/orderService";
import movieService from "../../../services/movieService";
import presentationService from "../../../services/presentationService";
var m = require('moment');

interface newPresentationState {
    isLoading: boolean,
    activeAdminMenuItem: string,
    presentationStart: any,
    movieId: string,
    roomId: string,
    basicPrice: number,
    movies: Array<{
        key: string,
        text: string,
        value: string
    }>,
    rooms: Array<{
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

class NewPresentation extends React.Component<{}, newPresentationState> {

    private mounted: boolean = false;

    constructor(props: any) {
        super(props);

        this.state = {
            isLoading: false,
            activeAdminMenuItem: 'orders',
            presentationStart: '',
            movieId: null,
            roomId: null,
            basicPrice: 0,
            movies: [{
                key: null,
                text: null,
                value: null
            }],
            rooms: [{
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

        //get movieData from backend
        let movieArr = [];

        const movies = await movieService.getAllMovies();

        const roomArr = roomData.map(item => ({
            key: item.roomId,
            text: item.name,
            value: item.roomId
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

        //set the states with mapped/modified data from backend
        if(this.mounted) {
            this.setState({
                movies: movieArr,
                rooms: roomArr
            })
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    //create presentation with data that admin put in form
    createPresentation = async () => {
        if (this.mounted) { this.setState({successModal: false}) }
        try {
            await presentationService.createPresentation(
                this.state.presentationStart,
                this.state.movieId,
                this.state.roomId,
                this.state.basicPrice,
            );

            //if creating was successfull -> Handle Messages and reset input fields
            if(this.mounted) {
                this.setState({
                    error: "",
                    successModal: true,
                    movieId: '',
                    roomId: '',
                    basicPrice: 0,
                    presentationStart: ''
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

    generatePresentationData = async () => {
        let hours = ['15:00', '15:15', '15:30', '15:45','16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45',
        '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45', '20:00', '20:15', '20:30', '20:45', '21:00', '21:15', '21:30', '21:45', '22:00', '22:15', '22:30', '22:45',
        '23:00', '23:15', '23:30', '23:45', '24:00', '24:15', '24:30', '24:45', '00:00'];

        this.state.movies.map(async item => {
            for(let i = 0; i < 20; i++){
                let timeString = "2021-0" + Math.floor(Math.random() * 5 + 1) + "-" + Math.floor(Math.random() * 21 + 10) + " " + hours[Math.floor(Math.random() * 24 + 1)];
                await presentationService.createPresentation(
                    timeString,
                    item.key,
                    roomData[Math.floor(Math.random() * 2 + 0)].roomId,
                    Math.floor(Math.random() * 10 + 6)
                );
            }
        })
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
                                <Button onClick={() => this.createPresentation()} color='green' icon labelPosition='left' basic type='submit'
                                    disabled={
                                        this.state.presentationStart === '' ||
                                        this.state.movieId == null ||
                                        this.state.roomId == null ||
                                        this.state.basicPrice <= 0 }>

                                    <Icon name='plus'/>
                                    Vorstellung anlegen
                                </Button>  
                                {/* <Button onClick={() => this.generatePresentationData()} >
                                    Generate
                                </Button>   */}
                                {this.state.successModal &&
                                <Message 
                                positive 
                                style={{"marginTop": "20px"}} 
                                header="Erfolgreich."
                                content="Vorstellung wurde erfolgreich angelegt."                             
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


                    </Grid.Column>
                </Grid>
            </Form>
        )
    }
}

export default NewPresentation;




