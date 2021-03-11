import * as React from "react";
import {Icon, Button, Grid, Dimmer, Loader, Form, Message} from "semantic-ui-react";
import movieService from "../../../services/movieService";
import presentationService from "../../../services/presentationService";
import moment from "moment";
import { ROOM_DATA } from "../../../constants";
var m = require('moment');

interface deletePresentationState {
    isLoading: boolean,
    presentationIDsforSelectedMovieStart: Array<{
        key: string,
        text: string,
        value: string
    }>,
    selectedPresentationIDStart: string,
    selectedMovieIDStart: string,
    movies: Array<{
        key: string,
        text: string,
        value: string
    }>,
    error: string,
    successModal: boolean,
    settingVariables: boolean
}

class DeletePresentation extends React.Component<{}, deletePresentationState> {

    private mounted: boolean = false;

    constructor(props: any) {
        super(props);

        this.state = {
            isLoading: false,
            presentationIDsforSelectedMovieStart: [],
            selectedPresentationIDStart: null,
            selectedMovieIDStart: null,
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

            if (this.mounted){
                this.setState({
                    movies: movieArr
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

    //delete presentation with data that admin put in form
    deletePresentation = async () => {
        if (this.mounted) { this.setState({successModal: false}) }
        try {
            await presentationService.deletePresentationById(
                this.state.selectedPresentationIDStart
            );

            //if delete was successfull -> Handle Messages and reset input fields
            if(this.mounted) {
                this.setState({
                    error: "",
                    successModal: true,
                    selectedMovieIDStart: null,
                    selectedPresentationIDStart: null
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


    //render form to delete presentation
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
                                onChange={(e, {value}) => {this.setState({selectedPresentationIDStart: value.toString()})}}
                                />
                        </Form.Group>                       
                        <Button onClick={() => this.deletePresentation()} color='red' icon labelPosition='left' basic type='submit'
                            disabled={
                                this.state.selectedPresentationIDStart == null ||
                                this.state.selectedMovieIDStart == null}>

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