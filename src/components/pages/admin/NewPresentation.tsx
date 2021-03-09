import * as React from "react";
import {Icon, Button, Grid, Dimmer, Loader, Form, Message} from "semantic-ui-react";
import { DateTimeInput } from "semantic-ui-calendar-react";
import adminService from "../../../services/orderService";
import movieService from "../../../services/movieService";
var m = require('moment');

interface newPresentationState {
    isLoading: boolean,
    activeAdminMenuItem: string,
    presentationStart: any,
    movieId: string,
    saalId: string,
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

class NewPresentation extends React.Component<{}, newPresentationState> {

    private mounted: boolean = false;

    constructor(props: any) {
        super(props);

        this.state = {
            isLoading: false,
            activeAdminMenuItem: 'orders',
            presentationStart: '',
            movieId: null,
            saalId: null,
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

        //get movieData und roomData from backend
        let movieArr = [];

        const movies = await movieService.getAllMovies();
        const rooms = await adminService.getRooms();

        const roomArr = rooms.data.map(room => ({
            key: room.saalid,
            text: room.name,
            value: room.saalid
        }))

        movies['data']['filme'].forEach(mov => {
            const obj = {
                key: mov.filmid.toString(),
                text: mov.name,
                value: mov.filmid.toString()
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
            await adminService.createPresentation(
                this.state.movieId,
                this.state.saalId,
                this.state.basicPrice,
                this.state.presentationStart
            );

            //if creating was successfull -> Handle Messages and reset input fields
            if(this.mounted) {
                this.setState({
                    error: "",
                    successModal: true,
                    movieId: '',
                    saalId: '',
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
                            value={this.state.saalId}
                            options={this.state.rooms}
                            fluid 
                            label='Saal auswählen' 
                            placeholder='Saal'
                            required
                            onChange={(e, {value}) => {this.setState({saalId: value.toString()})}}
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
                                        this.state.saalId == null ||
                                        this.state.basicPrice <= 0 }>

                                    <Icon name='save'/>
                                    Vorstellung anlegen
                                </Button>    
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




