import * as React from "react";
import {Grid, Image} from "semantic-ui-react";
import TopMenu from "../../menus/public/TopMenu";
import Slider from "react-slick";
import MovieOverview from './MovieOverview';
import movieServices from '../../../services/movieService';

interface ladingpageState {
    refreshCart: number,
    movies: [{}]
}

class Landingpage extends React.Component<{history: any}, ladingpageState> {
    
    private mounted: boolean = false;
    
    constructor(props: any) {
        super(props);

        this.state = {
            refreshCart: 0,
            movies: [{}]
        };
    }

    async componentDidMount() {
        this.mounted = true;

        window.scrollTo(0, 0);

        if(this.mounted) {
            var movies = await movieServices.getMovies();

            if(this.mounted && movies) {
                this.setState({
                    movies: movies.data.filme
                })
            }
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    handleCartCountOnLandingpage() {
        this.setState({refreshCart: this.state.refreshCart + 1})
    }
 
    pushToMovieDetailPage = (movie) => {
        this.props.history.push({
            pathname: '/movie',
            search: '?name='+(movie['name'].replace(/ /g, '-')).toLowerCase(),
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
            slidesToShow: 1,
            slidesToScroll: 1
          };

        return (
            <React.Fragment>
                <TopMenu refreshCart={this.state.refreshCart} history={this.props.history}/>

                <Grid>
                    <Grid.Row>
                        <Grid.Column>
                            <Slider {...settings}>
                                {this.state.movies.map((movie, index) => {
                                    return (
                                        <div key={index}>
                                            <h2 style={{'textAlign': 'center', 'fontSize': '32px'}}>
                                                {movie['name'] &&
                                                    <a onClick={() => this.pushToMovieDetailPage(movie)} style={{'cursor': 'pointer'}}>
                                                        {movie['name']} ({movie['filmstart'] && new Date(movie['filmstart']).getFullYear()})
                                                    </a>
                                                }
                                            </h2>
                                            
                                            <Image
                                                fluid
                                                src={movie['hintergrund_bild_link']}
                                                as='a'
                                                style={{'height': '520px', 'width': '1920px', 'cursor': 'pointer'}}
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
                            <h2 style={{'textAlign': 'center', 'fontSize': '36px'}}>Unserer Filme</h2>
                            <MovieOverview history={this.props.history} handleCartCountOnLandingpage={this.handleCartCountOnLandingpage} withoutTopBar={true}/>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

            </React.Fragment>
        )
    }
}

export default Landingpage;