import * as React from "react";
import {Card, Image, Button, Grid, Input, Message, Divider} from "semantic-ui-react";
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

    //functioon to add to shopping cart
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

    //handle search filter
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

    //push to detail mage with movie object
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

    //render stars with specific rating
    renderStars = (rating) => {
        const device = this.getDeviceType();

        if (device === "desktop"){
            return (
                <Rating name="half-rating-read" defaultValue={rating} precision={0.1} readOnly max={10} />
            )
        } else {
            return (
                <Rating name="half-rating-read" defaultValue={rating/2} precision={0.2} readOnly max={5} />
            )
        }
    }

    getDeviceType = () => {
        const ua = navigator.userAgent;
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
          return "tablet";
        }
        if (
          /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
            ua
          )
        ) {
          return "mobile";
        }
        return "desktop";
    };

    getColumnSize= () => {
        const device = this.getDeviceType();

        if (device === "tablet"){
            return 3
        } else if (device === "desktop"){
            return 5
        } else if (device === "mobile"){
            return 2
        }
    }


    render() {
        return (
            <React.Fragment>
                {!this.props.withoutTopBar &&
                <TopMenu refreshCart={this.state.refreshCart} history={this.props.history}/>}

                <Grid style={{'marginLeft':'10px', 'marginRight':'10px', 'minHeight': '800px'}}>

                    {!this.state.loadMovies &&
                    <React.Fragment>
                        <Grid.Row>
                        <Input
                            style={{'marginTop': '15px', 'maxHeight': '40px', 'width': '40%', 'marginBottom': '-10px'}}
                            loading={this.state.loading} 
                            placeholder='Suche...'
                            onChange={(event, {value}) => this.handleSearch(value)} />

                        </Grid.Row>
                        <Grid.Row>
                            <Divider style={{'width': '100%'}}/>
                        </Grid.Row>

                    </React.Fragment>
                    }

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

                    <Grid.Row columns={this.getColumnSize()}>
                        
                        {this.state.movies.length > 0 && this.state.movies.map((movie, index) => {
                            return (
                                <Grid.Column key={index} style={{}}>
                                    <Card key={index} style={{'minHeight': '800px', 'marginBottom': '30px', 'marginRight': 'auto', 'marginLeft': 'auto'}}>
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
                                            {movie['storyline'] && this.mounted && (movie["storyline"]).split(" Written by")[0].substring(0,250)}... <a onClick={() => this.pushToMovieDetailPage(movie)}>mehr lesen</a>
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