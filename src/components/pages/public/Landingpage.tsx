import * as React from "react";
import {Divider, Grid, Image, Segment} from "semantic-ui-react";
import TopMenu from "../../menus/public/TopMenu";
import Slider from "react-slick";
import MovieOverview from './MovieOverview';
import movieServices from '../../../services/movieService';
import userService from "../../../services/userService";
import { SELECTED_MOVIE_IDS_FOR_SLIDER, USER_COOKIE_INFO } from "../../../constants";
import MostPopularFilms from "./MostPopularFilms";

interface ladingpageState {
    refreshCart: number,
    movies: [{}],
    selectedMoviesForSlider: any,
    isLoading: boolean
}

class Landingpage extends React.Component<{history: any}, ladingpageState> {
    
    private mounted: boolean = false;
    
    constructor(props: any) {
        super(props);

        this.state = {
            refreshCart: 0,
            movies: [{}],
            selectedMoviesForSlider: [{}],
            isLoading: false
        };
    }

    async componentDidMount() {
        this.mounted = true;

        window.scrollTo(0, 0);

        if(this.mounted) {
            this.setState({isLoading: true});
            let movies = await movieServices.getAllMovies();

            let selectedMovies = [];
            movies.data.data.map((item) => {
                if(SELECTED_MOVIE_IDS_FOR_SLIDER.includes(item._id)){
                    selectedMovies.push(item)
                }
            })

            if(this.mounted && movies) {
                this.setState({
                    movies: movies.data.data,
                    selectedMoviesForSlider: selectedMovies
                })
            }
            this.setState({isLoading: false});
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    handleCartCountOnLandingpage() {
//        this.setState({refreshCart: this.state.refreshCart + 1})
    }
 
    pushToMovieDetailPage = (movie) => {
        let movieTitle = movie['originalTitle'];
        if (movie['originalTitle'] === ''){
            movieTitle = movie['title']
        }
        this.props.history.push({
            pathname: '/movie',
            search: '?name='+(movieTitle.replace(/ /g, '-')).toLowerCase(),
            state: { movieId: movie['_id'] }
        })
    }

    render() {

        var settings = {
            dots: false,
            arrows: false,
            infinite: true,
            autoplay: true,
            autoplayspreed: 500,
            slidesToShow: 5,
            slidesToScroll: 1
          };

        return (
            <React.Fragment>
                <TopMenu refreshCart={this.state.refreshCart} history={this.props.history}/>

                {!this.state.isLoading && <Grid>
                    <Grid.Row style={{'marginBottom': '100px'}}>
                        <Grid.Column>
                            <Slider {...settings} style={{'textAlign': 'center'}}>
                                {this.state.selectedMoviesForSlider.map((movie, index) => {
                                    return (
                                        <div key={index}>                                            
                                            <Image
                                                src={movie['posterurl']}
                                                as='a'
                                                style={{'height': '437px', 'width': '362px', 'cursor': 'pointer'}}
                                                onClick={() => this.pushToMovieDetailPage(movie)}
                                            />
                                        </div> 
                                    )
                                })}
                                
                                
                            </Slider>
                        </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <MostPopularFilms history={this.props.history} movies={this.state.selectedMoviesForSlider}/>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                }
            </React.Fragment>
        )
    }
}

export default Landingpage;