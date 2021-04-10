import * as React from "react";
import {Image, Button, Grid, List, Divider, Message, Popup} from "semantic-ui-react";
import TopMenu from "../../menus/public/TopMenu";
import presentationsService from "../../../services/presentationService";
import { DateInput } from "semantic-ui-calendar-react";
import movieService from "../../../services/movieService";
import moment from "moment";
import Rating from "@material-ui/lab/Rating";
import { arrayToString } from "../../../constants";
import PresentationDateComponent from "../../container/PresentationDateComponent";
import Slider from "react-slick"

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

            const getPresentationById = await presentationsService.getPresentationByMovieId(this.props.location.state.movieId);
    
            if(this.mounted) {
                this.setState({
                    presentations: getPresentationById.data.data,
                    initialPresentations: getPresentationById.data.data,
                    movie: getMovie.data.data,
                    isLoading: false
                })
            }
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
                    if(m(pres['presentationStart']).format("DD-MM-YYYY") === date) {
                        console.log("T")
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

    render() {

        const m = require('moment');
        var settings = {
            dots: true,
            infinite: true,
            arrows: false,
            speed: 500,
            slidesToShow: Math.min(this.state.presentations.length, 8),
            slidesToScroll: 1
          };

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
                                <List.Item key='actors'>{"Schauspieler: " + arrayToString(this.state.movie['actors'])}</List.Item>
                                <Divider style={{'width': "15%"}} />
                                <List.Item key='duration'>Länge: {moment.duration((this.state.movie['duration'])).asMinutes()} Minuten</List.Item>
                                <Divider style={{'width': "15%"}} />
                                <List.Item key='genres'>{"Genres: " + arrayToString(this.state.movie['genres'])}</List.Item>
                                <Divider style={{'width': "15%"}} />
                                <List.Item key='story' style={{'lineHeight': '1.9'}}>Beschreibung: {this.mounted && (this.state.movie["storyline"]).split(" Written by")[0]}</List.Item>
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
                            <Slider {...settings}>
                                {this.state.presentations && this.state.presentations.length > 0 && this.state.presentations.map((pres, index) => {
                                    return (
                                        <PresentationDateComponent index={index} presentation={pres} threeD={pres['3d']} history={this.props.history}/>
                                    )
                                })}
                            </Slider>
                        </Grid.Column>
                        <Grid.Column width={1}></Grid.Column>
                    </Grid.Row>

                    <Divider />

                    <Grid.Row columns="1">
                        <Grid.Column style={{'textAlign': 'center'}}>
                            <iframe width="700" height="540"
                            src={this.state.movie['youtubeurl']+"?autoplay=1"}>
                            </iframe>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                }                
            </React.Fragment>
        )
    }
    arrayToString(arg0: any) {
        throw new Error("Method not implemented.");
    }
}

export default MovieDetail;