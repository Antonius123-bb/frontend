import * as React from "react";
import {Button, Divider, Grid, Message, Popup} from "semantic-ui-react";
import TopMenu from "../../menus/public/TopMenu";
import presentationsService from '../../../services/presentationService';
import movieService from '../../../services/movieService';
import {DateInput} from 'semantic-ui-calendar-react';
import moment from "moment";
import { arrayToString } from "../../../constants";
const m = require('moment');
import Slider from "react-slick"
import PresentationDateComponent from "../../container/PresentationDateComponent";

/*
* Component to show all presentations categorized by movies
*/

class PresentationOverview extends React.Component<{withoutTopBar: any, history: any}, {isLoading: boolean, dataAvailable: boolean; date: string, refreshCart: number, initialPresentations: any, presentationsResult: any, initialMovies: any}> {
    
    private mounted: boolean = false;

    constructor(props: any) {
        super(props);

        this.state = {
            isLoading: false,
            date: "",
            refreshCart: 0,
            initialPresentations: [{}],
            presentationsResult: [{}],
            initialMovies: [{}],
            dataAvailable: false
        };
    }

    async componentDidMount() {
        this.mounted = true;

        window.scrollTo(0, 0);

        //get all movies and presentations
        if(this.mounted) {
            this.setState({isLoading: true})
            var presentations = await presentationsService.getAllPresentations();
            var movies = await movieService.getAllMovies();
        }

        //proceed the resolved data to generate a usabled strucutre
        const result = await this.generatePresentationData(movies.data.data, presentations.data.data);

        //set states with the return
        if(this.mounted && presentations.data) {
            this.setState({
                initialPresentations: presentations.data.data,
                initialMovies: movies.data.data,
                presentationsResult: result,
                isLoading: false
            })
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    generatePresentationData = (movies, presentations) => {
        //map all movies and save them in an array
        movies.map((mov) => {
            mov.presentations = [];
        })

        //find the correct presentation for a movie and save it to the movie object in the array
        presentations.forEach((pres) => {
            let movieI = movies.findIndex(movie => movie._id === pres.movieId);
            movies[movieI].presentations.push(pres);
        })

        //check if there are movies/presentations to return
        let available = false;
        movies.forEach(mov => {
            if(mov['presentations'].length > 0) {
                available = true;
            }
        })
        if(this.mounted) {
            this.setState({
                dataAvailable: available
            })
        }

        //return the structured data (movies+presentations)
        return movies;
    }

    //link to the detail page of a presentation -> param is the id of a presentation
    pushToPresentationDetailPage = (presentation) => {
        this.props.history.push({
            pathname: '/presentation/'+presentation['_id']
        })
    }

    //search the presentations on a specific date
    search = async (date) => {

        if (this.mounted) { this.setState({isLoading: true}) };
        //if reverse the date picker to print all presentations
        if(date.length === 0) {
            //generate the structured printable data
            const result = await this.generatePresentationData(this.state.initialMovies, this.state.initialPresentations);

            if(this.mounted) {
                this.setState({
                    presentationsResult: result,
                    isLoading: false
                })
            } 
        } else {
            //save all presentations that match the specific date
            let presentations = [];
        
            //loop through the initial list and find the matching ones
            this.state.initialPresentations.map(pres => {
                if(m(pres['presentationStart']).format("DD-MM-YYYY") === date) {
                    presentations.push(pres);
                }
            })

            //generate the structured printable data
            const result = await this.generatePresentationData(this.state.initialMovies, presentations);
    
            if(this.mounted) {
                this.setState({
                    presentationsResult: result,
                    isLoading: false
                })
            }
        }
    }

    render() {
        var settings = {
            dots: true,
            infinite: true,
            arrows: false,
            speed: 500,
            slidesToShow: 9,
            slidesToScroll: 1
          };

        return (
            <React.Fragment>
                {!this.props.withoutTopBar &&
                <TopMenu refreshCart={this.state.refreshCart} history={this.props.history} />}

                {!this.state.isLoading &&
                    <Grid style={{'marginLeft':'10px', 'marginRight':'10px'}}>
                    <Grid.Row>
                        <DateInput
                        style={{'marginTop': '10px', 'marginBottom': '-10px', 'width': '200%'}}
                        animation={null}
                        name="date"
                        placeholder="Datum wählen"
                        value={this.state.date}
                        iconPosition="right"
                        onChange={(event, {value}) => {this.search(value), this.setState({ date: value.toString() })}}
                        minDate={new Date()}
                        clearable
                        />

                    </Grid.Row>
                    <Grid.Row>
                    <Divider style={{'width': '100%'}}/>
                    </Grid.Row>
                    

                    {!this.state.dataAvailable && !this.state.isLoading &&
                        <Grid.Row style={{'height': '600px'}} columns={5} centered>
                            <Message size="huge">
                                <Message.Header>Keine Vorstellungen gefunden</Message.Header>
                                <p>
                                    Für Ihre Suchanfrage sind keine Vorstellungen bei uns hinterlegt.
                                </p>
                            </Message>
                        </Grid.Row>
                    }

                        
                    {this.state.dataAvailable && this.state.presentationsResult.length > 0 && this.state.presentationsResult.map((data, index) => {
                        if(data['presentations'] && data['presentations'].length != 0) {
                            return (
                                <Grid.Row style={{'height': '300px', 'marginBottom': '5%'}} key={index}>
                                    <Grid.Column width="2">
                                        <img height="300px" src={data && data['posterurl']} />
                                    </Grid.Column>
                                    
                                    <Grid.Column width="14" style={{'lineHeight': '2'}}>
                                        <Grid.Row>
                                            <h2>{data && (data['originalTitle'] === "" ? data['title'] : data['originalTitle'])}</h2>
                                            <b>Rating: {data && data['imdbRating']}&nbsp;|&nbsp;
                                            {data && moment.duration(data['duration']).asMinutes()}min.</b> <br/>
                                            {data && arrayToString(data['genres'])} <br/>
                                        </Grid.Row>
                                        <Divider hidden/>
                                        <Grid.Row>
                                            <Slider {...settings}>
                                                {data['presentations'] && data['presentations'].length > 0 && data['presentations'].map((pres, index2) => {
                                                    return (
                                                        <PresentationDateComponent index={{index2}} presentation={pres} threeD={pres['3d']} history={this.props.history}/>
                                                    )
                                                })}
                                            </Slider>
                                        </Grid.Row>
                                    </Grid.Column>
                                </Grid.Row>
                            )
                        }
                    })}

                </Grid>
                }
                
            </React.Fragment>
        )
    }
}

export default PresentationOverview;