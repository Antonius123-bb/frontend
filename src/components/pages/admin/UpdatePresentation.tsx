import * as React from "react";
import {Icon, Button, Grid, Dimmer, Loader, Form, Message, Segment} from "semantic-ui-react";
import { DateTimeInput } from "semantic-ui-calendar-react";
import orderService from "../../../services/orderService";
import movieService from "../../../services/movieService";
import presentationService from "../../../services/presentationService";
import { ROOM_DATA } from "../../../constants";
import moment from "moment";
var m = require('moment');

interface updatePresentationState {
    isLoading: boolean,
    activeAdminMenuItem: string,
    presentationStart: any,
    movieId: string,
    roomId: string,
    basicPrice: number,
    presentationIDsforSelectedMovieStart: Array<{
        key: string,
        text: string,
        value: string
    }>,
    selectedPresentationIDStart: string,
    selectedMovieIDStart: string,
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
    successModal: boolean,
    settingVariables: boolean
}

class UpdatePresentation extends React.Component<{}, updatePresentationState> {

    private mounted: boolean = false;

    constructor(props: any) {
        super(props);

        this.state = {
            isLoading: false,
            activeAdminMenuItem: 'orders',
            presentationStart: '',
            movieId: null,
            roomId: '',
            basicPrice: 0,
            presentationIDsforSelectedMovieStart: [],
            selectedPresentationIDStart: null,
            selectedMovieIDStart: null,
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
            successModal: false,
            settingVariables: false
        }
    }

    async componentDidMount() {
        this.mounted = true;
        try {

            const movies = await movieService.getAllMovies();
            let movieArr = [];

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

            const roomArr = ROOM_DATA.map(item => ({
                key: item.roomId,
                text: item.name,
                value: item.roomId
            }))

            if (this.mounted){
                this.setState({
                    movies: movieArr,
                    rooms: roomArr
                })
            }

        }
        catch {

        }

    }


    getPresentationByMovieId = async () => {
        try {
            if (this.mounted){
                this.setState({
                    selectedPresentationIDStart: null,
                    successModal: false,
                    error: ""
                })
            }
            const presentations = await presentationService.getPresentationByMovieId(this.state.selectedMovieIDStart);

            const dropDownPreData = presentations.data.data.map(item => ({
                key: item._id,
                text: moment(new Date(item.presentationStart)).format("DD.MM.YYYY HH:mm") + ", " + this.getRoom(item.roomId), 
                value: item._id
            }))
    
            if (this.mounted) {
                this.setState({
                    presentationIDsforSelectedMovieStart: dropDownPreData
                })
            }

        } catch {

        }
    }

    getRoom = (roomId) => {
        try {
            if(!this.state.settingVariables){
                const room = ROOM_DATA.find(item => item.roomId === roomId);
                return room.name
            }
        } catch (e){

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
                this.state.selectedPresentationIDStart,
                this.state.presentationStart,
                this.state.movieId
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
                    selectedMovieIDStart: null,
                    selectedPresentationIDStart: null
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

    setValues = async () => {
        try {
            if(this.mounted){
                this.setState({
                    settingVariables: true
                })
            }
            const presentation = await presentationService.getPresentationById(this.state.selectedPresentationIDStart);
            const date = moment(new Date(presentation.data.data.presentationStart)).format("YYYY-MM-DD HH:mm");
            if (this.mounted){
                this.setState({
                    movieId: presentation.data.data.movieId,
                    basicPrice: presentation.data.data.basicPrice,
                    roomId: presentation.data.data.roomId,
                    presentationStart: date.toString(),
                    settingVariables: false
                })
            }

        } catch {

        }
    };

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
                                value={this.state.selectedMovieIDStart}
                                options={this.state.movies}
                                fluid 
                                label='Film auswählen' 
                                placeholder='Film auswählen'
                                required
                                search
                                onChange={(e, {value}) => {this.setState({selectedMovieIDStart: value.toString()}, () => this.getPresentationByMovieId())}}
                                />
                            <Form.Select 
                                value={this.state.selectedPresentationIDStart}
                                options={this.state.presentationIDsforSelectedMovieStart}
                                fluid 
                                label='Präsentation auswählen' 
                                placeholder='Präsentation auswählen'
                                required
                                search
                                disabled={this.state.presentationIDsforSelectedMovieStart.length === 0 && this.state.selectedMovieIDStart === null}
                                onChange={(e, {value}) => {this.setState({selectedPresentationIDStart: value.toString()}, () => this.setValues())}}
                                />
                        </Form.Group>
                        {this.state.selectedPresentationIDStart != null &&
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
                            <Form.Input 
                            value={this.getRoom(this.state.roomId)}
                            fluid 
                            label='Saal' 
                            placeholder='Saal'
                            disabled={true}
                            />
                            <Form.Input
                            value={this.state.basicPrice}
                            fluid
                            name='basicPrice'
                            label='Basis Preis'
                            type='number'
                            placeholder='Basis Preis'
                            disabled={true}
                            />
                        </Form.Group>
                        }

                        {this.state.selectedPresentationIDStart != null &&
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
                                <Button onClick={() => this.updatePresentation()} color='green' icon labelPosition='left' basic type='submit'
                                    disabled={
                                        this.state.presentationStart === '' ||
                                        this.state.movieId == null ||
                                        this.state.selectedPresentationIDStart == null ||
                                        this.state.selectedMovieIDStart == null ||
                                        this.state.roomId == null ||
                                        this.state.basicPrice <= 0 }>

                                    <Icon name='edit'/>
                                    Änderungen speichern
                                </Button>                         
                        </Grid.Row>
                        }
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

                    </Grid.Column>
                </Grid>
            </Form>
        )
    }
}

export default UpdatePresentation;