import * as React from "react";
import {Card, Image, Button, Grid, Input, Message} from "semantic-ui-react";
import TopMenu from "../../menus/public/TopMenu";
import movieService from '../../../services/movieService';
import Rating from "@material-ui/lab/Rating";

class MovieOverview extends React.Component<{handleCartCountOnLandingpage: any, withoutTopBar: boolean, history: any}, {refreshCart: number, movies: any, initialMovies: any, loading: boolean, loadMovies: boolean}> {

    private mounted: boolean = false;

    constructor(props: any) {
        super(props);

        this.state = {
            refreshCart: 0,
            movies: [],
            initialMovies: [{}],
            loading: false,
            loadMovies: false
        };
    }

    async componentDidMount() {
        this.mounted = true;

        window.scrollTo(0, 0);

        if(this.mounted) {
            this.setState({loadMovies: true})
            var movies = await movieService.getAllMovies();
        }


        if(this.mounted && movies) {
            this.setState({
                movies: movies.data.data,
                initialMovies: movies.data.data,
                loadMovies: false
            })
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    saveToCart(id: any) {
        var cart = {};

        var storageCart = localStorage.getItem("cart");
        if(storageCart != undefined) {
            cart = JSON.parse(storageCart);
        }

        if(cart[id]) {
            cart[id] = {
                count: cart[id].count + 1
            }
        } else {
            cart[id] = {
                count: 1
            };
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        if(this.mounted) {
            this.setState({refreshCart: this.state.refreshCart + 1})

            this.props.handleCartCountOnLandingpage();
        }
    }

    handleSearch = (value) => {
        let newMovies = [];
        if(this.mounted) {
            this.setState({
                loading: true
            })
        }

        this.state.initialMovies.map(movie => {
            let movieTitle = movie['originalTitle'];
            if (movie['originalTitle'] === ''){
                movieTitle = movie['title']
            }
            const name = movieTitle.toLowerCase();

            if(name.indexOf(value.toLowerCase()) > -1) {
                newMovies.push(movie);
            }
        })

        if(this.mounted) {
            this.setState({
                movies: newMovies,
                loading: false
            })
        }
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

    renderStars = (rating) => {
        return (
            <Rating name="half-rating-read" defaultValue={rating} precision={0.1} readOnly  max={10} />
        )
    }

    render() {

        return (
            <React.Fragment>
                {!this.props.withoutTopBar &&
                <TopMenu refreshCart={this.state.refreshCart} history={this.props.history}/>}

                <Grid style={{'marginLeft':'10px', 'marginRight':'10px', 'minHeight': '800px'}}>

                    <Input
                        style={{'marginTop': '15px', 'maxHeight': '40px'}}
                        loading={this.state.loading} 
                        placeholder='Suche...'
                        onChange={(event, {value}) => this.handleSearch(value)} />

                    {this.state.movies.length === 0 && this.state.loadMovies === false && 
                        <Grid.Row columns={5} centered>
                            <Message size="huge">
                                <Message.Header>Keine Filme gefunden</Message.Header>
                                <p>
                                    Für Ihre Suchanfrage sind keine Filme bei uns hinterlegt.
                                </p>
                            </Message>
                        </Grid.Row>
                    }

                    <Grid.Row columns={5}>
                        
                        {this.state.movies.length > 0 && this.state.movies.map((movie, index) => {
                            return (
                                <Grid.Column key={index}>
                                    <Card style={{'minHeight': '800px', 'marginBottom': '30px'}}>
                                        <Image src={movie['posterurl']} wrapped ui={false} />
                                        <Card.Content>
                                        <Card.Header>{movie['originalTitle'] != '' ? movie['originalTitle'] : movie['title']}</Card.Header>
                                        <Card.Meta>
                                            {movie['releaseDate'] && new Date(movie['releaseDate']).getFullYear()}
                                        </Card.Meta>
                                        <Card.Meta>
                                          {this.renderStars(movie['imdbRating'])}
                                        </Card.Meta>
                                        <Card.Description>
                                            {movie['storyline'] && movie['storyline'].substring(0,250)}... <a onClick={() => this.pushToMovieDetailPage(movie)}>mehr lesen</a>
                                        </Card.Description>
                                        </Card.Content>
                                        <Card.Content extra>
                                            <Button onClick={() => this.pushToMovieDetailPage(movie)}
                                            >Mehr erfahren</Button>
                                        </Card.Content>
                                    </Card>
                                </Grid.Column>
                            )
                        })}
                    
                    </Grid.Row>
                </Grid>
            </React.Fragment>
        )
    }
}

export default MovieOverview;