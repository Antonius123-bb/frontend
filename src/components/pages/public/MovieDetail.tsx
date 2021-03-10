import * as React from "react";
import {Image, Button, Grid, List, Divider, Message, Popup} from "semantic-ui-react";
import TopMenu from "../../menus/public/TopMenu";
import presentationsService from "../../../services/presentationService";
import { DateInput } from "semantic-ui-calendar-react";
import movieService from "../../../services/movieService";
import moment from "moment";
import Rating from "@material-ui/lab/Rating";


const m = require('moment');

class MovieDetail extends React.Component<{location: any, history: any}, {movie: any, presentations: any, initialPresentations: any, date: string, isLoading: boolean}> {
    
    private mounted: boolean = false;

    constructor(props: any) {
        super(props);

        this.state = {
            movie: {},
            presentations: [{}],
            initialPresentations: [{}],
            date : "",
            isLoading: false
        };
    }

    async componentDidMount() {
        try {
            this.mounted = true;
            if (this.mounted){ this.setState({isLoading: true}) };
    
            window.scrollTo(0, 0);
    
            const getMovie = await movieService.getMovieById(this.props.location.state.movieId);
    
            if(this.mounted) {
                this.setState({
                    //presentations: getPresentationById.data,
                    //initialPresentations: getPresentationById.data,
                    movie: getMovie.data.data,
                    isLoading: false
                })
            }
            console.log("TEST ", this.state.movie)
            

        }
        catch {

        }
    }

    componentWillUnmount(): void {
        this.mounted = false;
    }

    async componentDidUpdate(prevProps) {
        try {
            if(prevProps != this.props) {
                this.setState({
                    movie: this.props.location.state.movie,
                    isLoading: true
                })
    
                const getPresentationById = await presentationsService.getPresentationByMovieId(this.props.location.state.movie.filmid);
    
                if(this.mounted) {
                    this.setState({
                        presentations: getPresentationById.data,
                        initialPresentations: getPresentationById.data,
                        isLoading: false
                    })
                }
            }

        }
        catch {

        }
    }

    pushToPresentationDetailPage = (presentation) => {
        try {
            this.props.history.push({
                pathname: '/presentation/'+presentation['vorstellungsid']
            })

        }
        catch {

        }
    }

    
    search = async (date) => {
        try {

            if(date.length === 0) {
    
                if(this.mounted) {
                    this.setState({
                        presentations: this.state.initialPresentations
                    })
                }
            } else {
                let presentations = [];
        
                this.state.initialPresentations.map((pres) => {
                    if(m(pres['vorstellungsbeginn']).format("DD-MM-YYYY") === date) {
                        presentations.push(pres);
                    }
                })
        
                if(this.mounted) {
                    this.setState({
                        presentations: presentations
                    })
                }
            }

        }
        catch {

        }
    }

    arrayToString = (inputArray) => {
        try {
            if (this.mounted && inputArray){
            
                let string = " ";
                inputArray.map((item, index) => {
                    if(index === 0){
                        string = inputArray[index]
                    } else {
                        string = string + ", " + inputArray[index]
                    }
                })            
                return string;
            } else {
                return "No data"
            }

        } catch (e) {
            console.log("ERROR ", e)
        }

    }

    render() {

        const m = require('moment');

        return (
            <React.Fragment>
                <TopMenu refreshCart={0} history={this.props.history}/>
                {!this.state.isLoading &&
                    <Grid centered style={{'marginLeft':'150px', 'marginRight':'150px'}}>
                    <Grid.Row columns="2">
                        <Grid.Column width="10" floated="right">

                            <h2 style={{'marginBottom': '5%'}}>{this.state.movie['orginalTitle'] != "" ? this.state.movie['title'] : this.state.movie['originalTitle']}</h2>
                            <List>
                                <Grid>
                                <Grid.Row columns={2}>
                                    <Grid.Column width={3}>
                                    <List.Item key='imdb'>IMDd Rating: {this.state.movie['imdbRating']}</List.Item>
                                    </Grid.Column>
                                    <Grid.Column>
                                    <Rating name="half-rating-read" defaultValue={this.state.movie['imdbRating']} precision={0.1} readOnly max={10} />
                                    </Grid.Column>
                                </Grid.Row>
                                </Grid>
                                
                                <Divider style={{'width': "15%"}} />
                                <List.Item key='released'>Veröffentlichungsdatum: {m(this.state.movie['releaseDate']).format("DD.MM.YYYY")}</List.Item>
                                <Divider style={{'width': "15%"}} />
                                <List.Item key='actors'>{"Schauspieler: " + this.arrayToString(this.state.movie['actors'])}</List.Item>
                                <Divider style={{'width': "15%"}} />
                                <List.Item key='duration'>Länge: {moment.duration((this.state.movie['duration'])).asMinutes()} Minuten</List.Item>
                                <Divider style={{'width': "15%"}} />
                                <List.Item key='genres'>{"Genres: " + this.arrayToString(this.state.movie['genres'])}</List.Item>
                                <Divider style={{'width': "15%"}} />
                                <List.Item key='story' style={{'lineHeight': '1.9'}}>Beschreibung: {this.state.movie['storyline']}</List.Item>
                            </List>
                        </Grid.Column>
                        <Grid.Column width="6">
                            <Image style={{'float': 'right'}} size="medium" src={this.state.movie['posterurl']}/>
                        </Grid.Column>
                    </Grid.Row>

                    <Divider />

                    <Grid.Row>

                    <DateInput
                        animation={null}
                        name="date"
                        placeholder="Datum wählen"
                        value={this.state.date}
                        iconPosition="left"
                        onChange={(event, {value}) => {this.search(value), this.setState({ date: value.toString() })}}
                        minDate={new Date()}
                        clearable
                        />

                    </Grid.Row>

                    <Grid.Row columns={3}>
                        <Grid.Column width={1}></Grid.Column>
                        <Grid.Column width={14} style={{'textAlign': 'center'}}>
                            {this.state.presentations && this.state.presentations.length === 0 &&
                                <Message 
                                color='grey'
                                header='Keine Vorstellungen gefunden.'
                                content='An dem gewählten Datum zeigen wir die gewünschte Vorstellung leider nicht.'
                                />
                            }

                            {this.state.presentations && this.state.presentations.length > 0 && this.state.presentations.slice(0,7).map((pres, index) => {
                                return (
                                    <div style={{'float': 'left', 'marginRight': '8px'}}>
                                        <b><span style={{'fontSize': '18px'}}>{pres['vorstellungsbeginn'] && m(pres['vorstellungsbeginn']).locale('de').format("dddd")},&nbsp; 
                                        {pres['vorstellungsbeginn'] && m(pres['vorstellungsbeginn']).format("DD.MM")}</span></b><br/>
                                        {pres['3d'] ?
                                            <Popup content='3D Vorstellung' position='top center' trigger={
                                                <Button onClick={() => this.pushToPresentationDetailPage(pres)} inverted color={'youtube'}>
                                                    {pres['vorstellungsbeginn'] && m(pres['vorstellungsbeginn']).locale('de').format("HH:mm")}
                                                </Button>
                                            } /> 
                                            :
                                            <Button onClick={() => this.pushToPresentationDetailPage(pres)} inverted color={'facebook'}>
                                                {pres['vorstellungsbeginn'] && m(pres['vorstellungsbeginn']).locale('de').format("HH:mm")}
                                            </Button>
                                        }
                                    </div>
                                )
                            })}
                        </Grid.Column>
                        <Grid.Column width={1}></Grid.Column>
                    </Grid.Row>

                    <Divider />

                    <Grid.Row columns="1">
                        <Grid.Column style={{'textAlign': 'center'}}>
                            <iframe width="700" height="540"
                            src={"https://www.youtube.com/embed/"+this.state.movie['youtubeurl']+"?autoplay=1"}>
                            </iframe>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                }                
            </React.Fragment>
        )
    }
}

export default MovieDetail;