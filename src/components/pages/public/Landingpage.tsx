import * as React from "react";
import {Grid, Image} from "semantic-ui-react";
import TopMenu from "../../menus/public/TopMenu";
import Slider from "react-slick";
import MovieOverview from './MovieOverview';
import movieServices from '../../../services/movieService';

interface ladingpageState {
    refreshCart: number,
    movies: [{}],
    isLoading: boolean
}

class Landingpage extends React.Component<{history: any}, ladingpageState> {
    
    private mounted: boolean = false;
    
    constructor(props: any) {
        super(props);

        this.state = {
            refreshCart: 0,
            movies: [{}],
            isLoading: false
        };
    }

    async componentDidMount() {
        this.mounted = true;

        window.scrollTo(0, 0);

        if(this.mounted) {
            this.setState({isLoading: true});
            var movies = await movieServices.getAllMovies();
            

            if(this.mounted && movies) {
                this.setState({
                    movies: movies.data.data
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
        let movieName = movie['originalTitle'];
        if (movie['originalTitle'] === ''){
            movieName = movie['title']
        }
        this.props.history.push({
            pathname: '/movie',
            search: '?name='+(movieName.replace(/ /g, '-')).toLowerCase(),
            state: { movie: movie }
        })
    }


    render() {

        var settings = {
            dots: false,
            arrows: false,
            infinite: true,
            autoplay: true,
            autoplayspreed: 1500,
            slidesToShow: 5,
            slidesToScroll: 1
          };

        return (
            <React.Fragment>
                <TopMenu refreshCart={this.state.refreshCart} history={this.props.history}/>

                <Grid>
                    <Grid.Row>
                        <Grid.Column>
                            <Slider {...settings} style={{'textAlign': 'center'}}>
                                {this.state.movies.map((movie, index) => {
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
                            <h2 style={{'textAlign': 'center', 'fontSize': '36px'}}>Unsere Filme</h2>
                            <MovieOverview history={this.props.history} handleCartCountOnLandingpage={this.handleCartCountOnLandingpage} withoutTopBar={true}/>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

            </React.Fragment>
        )
    }
}

export default Landingpage;