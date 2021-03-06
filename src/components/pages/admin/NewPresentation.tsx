import * as React from "react";
import { Icon, Button, Grid, Dimmer, Loader, Form, Message, Checkbox } from "semantic-ui-react";
import { DateTimeInput } from "semantic-ui-calendar-react";
import movieService from "../../../services/movieService";
import presentationService from "../../../services/presentationService";
import { HOURS, ROOM_DATA } from "../../../constants";
import moment from "moment";

interface newPresentationState {
    isLoading: boolean,
    presentationStart: any,
    movieId: string,
    roomId: string,
    threeD: boolean,
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
    successModal: boolean,
    currentMovieName: string,
    currentMovieDuration: number
}

class NewPresentation extends React.Component<{}, newPresentationState> {

    private mounted: boolean = false;

    constructor(props: any) {
        super(props);

        this.state = {
            isLoading: false,
            presentationStart: '',
            movieId: null,
            roomId: null,
            threeD: false,
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
            successModal: false,
            currentMovieName: '',
            currentMovieDuration: null
        }
    }

    async componentDidMount() {
        this.mounted = true;

        try {
            //get movieData from backend
            let movieArr = [];

            const movies = await movieService.getAllMovies();

            const roomArr = ROOM_DATA.map(item => ({
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
        } catch (e) {
            console.log("Error ",e)
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
                this.state.basicPrice,
                this.state.roomId,
                this.state.threeD
            );

            //if creating was successfull -> Handle Messages and reset input fields
            if(this.mounted) {
                this.setState({
                    error: "",
                    successModal: true,
                    movieId: '',
                    roomId: '',
                    threeD: false,
                    basicPrice: 0,
                    presentationStart: ''
                })
            }
        //if creating was unsuccessfull
        } catch (e) {
            console.log("Error ",e)

            if(this.mounted) {
                this.setState({
                    error: e.response.data
                })
            }
        }
    }

    generatePresentationData = async () => {
        try {
            this.state.movies.map(async item => {
                for(let i = 0; i < 20; i++){
                    let timeString = "2021-0" + Math.floor(Math.random() * 5 + 1) + "-" + Math.floor(Math.random() * 21 + 10) + " " + HOURS[Math.floor(Math.random() * 24 + 1)];
                    await presentationService.createPresentation(
                        timeString,
                        item.key,
                        Math.floor(Math.random() * 10 + 6),
                        ROOM_DATA[Math.floor(Math.random() * 2 + 0)].roomId,
                        Math.floor(Math.random() * 2 + 0) === 0 ? true : false
                    );
                }
            })

        } catch (e) {
            console.log("Error ",e)
        }
    }

    async componentDidUpdate (prevProps, prevState) {
        try {
            if(prevState.movieId != this.state.movieId && this.mounted && this.state.movieId != '') {
                const movie = await movieService.getMovieById(this.state.movieId);
                let movieName = movie.data.data.originalTitle;
                if(movie.data.data.originalTitle === ""){
                    movieName = movie.data.data.title
                }
                if(this.mounted){
                    this.setState({
                        currentMovieName: movieName,
                        currentMovieDuration: moment.duration(movie.data.data.duration).asMinutes()
                    })
                }
            }
        } catch (e) {
            console.log("Error ",e)
        }
    }


    //render form to create presentation
    render() {
        return (
            <Form>
                <Dimmer active={this.state.isLoading} inverted>
                    <Loader inverted content='L??dt' />
                </Dimmer>
                <Grid columns={1}>
                    <Grid.Column>
                        <Form.Group widths='equal'>
                            <Form.Select 
                            value={this.state.movieId}
                            options={this.state.movies}
                            fluid 
                            label='Film ausw??hlen' 
                            placeholder='Film'
                            required
                            onChange={(e, {value}) => {this.setState({movieId: value.toString()})}}
                            />
                            <Form.Select 
                            value={this.state.roomId}
                            options={this.state.rooms}
                            fluid 
                            label='Saal ausw??hlen' 
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
                            <Checkbox 
                                style={{'marginBottom': '10px'}}
                                label='3D Vorstellung' 
                                checked={this.state.threeD} 
                                onChange={() => this.setState((prevState) => ({ threeD: !prevState.threeD }))}
                            />  

                            {this.state.presentationStart != '' && !this.state.isLoading && this.state.movieId != null &&
                                <div style={{'marginBottom': '10px'}}>
                                    Die gesch??tzte Dauer f??r die Vorstellung des Films "{this.state.currentMovieName}" betr??gt {this.state.currentMovieDuration} Minuten.
                                </div>
                            } 
                            <br/>

                            <Button onClick={() => this.createPresentation()} color='green' icon labelPosition='left' basic type='submit'
                                disabled={
                                    this.state.presentationStart === '' ||
                                    this.state.movieId == null ||
                                    this.state.roomId == null ||
                                    this.state.basicPrice <= 0 }>

                                <Icon name='plus'/>
                                Vorstellung anlegen
                            </Button>  
                            <Button onClick={() => this.generatePresentationData()} >
                                Generate
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