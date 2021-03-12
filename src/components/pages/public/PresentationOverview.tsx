import * as React from "react";
import {Button, Grid, Message, Popup} from "semantic-ui-react";
import TopMenu from "../../menus/public/TopMenu";
import presentationsService from '../../../services/presentationService';
import movieService from '../../../services/movieService';
import {DateInput} from 'semantic-ui-calendar-react';
import moment from "moment";
import { arrayToString } from "../../../constants";
const m = require('moment');

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
        console.log("PRESEM ", presentation)
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
                    presentationsResult: result
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

        return (
            <React.Fragment>
                {!this.props.withoutTopBar &&
                <TopMenu refreshCart={this.state.refreshCart} history={this.props.history} />}

                {!this.state.isLoading &&
                    <Grid style={{'marginLeft':'10px', 'marginRight':'10px'}}>

                    <DateInput
                    style={{'marginTop': '10px'}}
                    animation={null}
                    name="date"
                    placeholder="Datum wählen"
                    value={this.state.date}
                    iconPosition="left"
                    onChange={(event, {value}) => {this.search(value), this.setState({ date: value.toString() })}}
                    minDate={new Date()}
                    clearable
                    />

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
                                <Grid.Row style={{'marginLeft':'300px', 'height': '300px'}} key={index}>
                                    <Grid.Column style={{'width': '250px', 'height': '250px'}}>
                                        <img width="250px" height="250px" src={data && data['posterurl']} />
                                    </Grid.Column>
                                    
                                    <Grid.Column style={{'width': '650px', 'height': '250px', 'lineHeight': '2'}}>

                                            <h2>{data && (data['originalTitle'] === "" ? data['title'] : data['originalTitle'])}</h2>
                                            <b>Rating: {data && data['imdbRating']}&nbsp;|&nbsp;
                                            {data && moment.duration(data['duration']).asMinutes()}min.</b> <br/>
                                            {data && arrayToString(data['genres'])} <br/>

                                            <div style={{'width': '1000px'}}>
                                            {data['presentations'] && data['presentations'].length > 0 && data['presentations'].map((pres, index2) => {
                                                return (
                                                    <div style={{'float': 'left', 'marginRight': '8px'}}>
                                                        <b><span style={{'fontSize': '18px'}}>{pres['presentationStart'] && m(pres['presentationStart']).locale('de').format("dddd")},&nbsp; 
                                                        {pres['presentationStart'] && m(pres['presentationStart']).format("DD.MM")}</span></b><br/>
                                                        {pres['3d'] ?
                                                            <Popup content='3D Vorstellung' position='top center' trigger={
                                                                <Button onClick={() => this.pushToPresentationDetailPage(pres)} inverted color={'youtube'}>
                                                                    {pres['presentationStart'] && m(pres['presentationStart']).locale('de').format("HH:mm")}
                                                                </Button>
                                                            } /> 
                                                            :
                                                            <Button onClick={() => this.pushToPresentationDetailPage(pres)} inverted color={'facebook'}>
                                                                {pres['presentationStart'] && m(pres['presentationStart']).locale('de').format("HH:mm")}
                                                            </Button>
                                                        }
                                                    </div>
                                                )
                                            })}
                                            </div>
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