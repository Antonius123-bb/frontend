import * as React from "react";
import {Divider, Grid, Image, Segment} from "semantic-ui-react";
import { SELECTED_MOST_POPULAR_MOVIES } from "../../../constants";

interface MostPopularFilmsState {
    mostPopMov: any,
    allMovies: any,
    isLoading: boolean
}

class MostPopularFilms extends React.Component<{history: any, movies: any}, MostPopularFilmsState> {
    
    private mounted: boolean = false;
    
    constructor(props: any) {
        super(props);

        this.state = {
            mostPopMov: [{}],
            allMovies: this.props.movies,
            isLoading: false
        };
    }

    async componentDidMount() {
        this.mounted = true;
        this.getPopMovData();
    }

    getPopMovData = () => {
        try {
            if(this.mounted){
                this.setState({isLoading: true})
            }
            let arrayThree = [];
            const allMovies = this.state.allMovies;
            SELECTED_MOST_POPULAR_MOVIES.map((item, index) => {
                const obj = allMovies[SELECTED_MOST_POPULAR_MOVIES[index]];

                let movieTitle = obj['originalTitle'];
                if (obj['originalTitle'] === ''){
                    movieTitle = obj['title']
                }
                arrayThree.push(
                    {
                        posterurl: obj['posterurl'],
                        title: movieTitle,
                        _id: obj['_id']
                    }
                )
            })
            if (this.mounted){
                this.setState({
                    isLoading: false,
                    mostPopMov: arrayThree
                })
            }
        } catch {

        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    pushToMovieDetailPage = (movie) => {
        this.props.history.push({
            pathname: '/movie',
            search: '?name='+(movie['title'].replace(/ /g, '-')).toLowerCase(),
            state: { movieId: movie['_id'] }
        })
    }

    returnColumn = (indexInArray) => {
        let border = '';
        let backgroundColor = '';
        let marginTop = '';
        let place = ''
        switch (indexInArray){
            case (0): {
                backgroundColor = 'silver';
                border = '10px solid silver';
                marginTop = '100px';
                place = '2'
                break;  
            };
            case 1: {
                backgroundColor = 'gold';
                border = '10px solid gold';
                marginTop = '0px';
                place = '1'
                break;
            };
            case 2: {
                backgroundColor = '#cd7f32';
                border = '10px solid #cd7f32';
                marginTop = '200px';
                place = '3'
                break;
            } 
            default: {

            }
        }

        return (
            <Grid.Column width={4} style={{'marginTop': marginTop}}>
                <div onClick={() => this.pushToMovieDetailPage((this.state.mostPopMov)[indexInArray])} style={{'textAlign': 'center', 'fontSize': '24px', 'marginBottom': '10px', 'cursor': 'pointer'}}>{(this.state.mostPopMov)[indexInArray].title}</div>
                <Image onClick={() => this.pushToMovieDetailPage((this.state.mostPopMov)[indexInArray])}  src={(this.state.mostPopMov)[indexInArray]['posterurl']} style={{'marginLeft': 'auto', 'marginRight': 'auto', 'width': '300px', 'border': border, 'cursor': 'pointer'}}/>
                <Segment onClick={() => this.pushToMovieDetailPage((this.state.mostPopMov)[indexInArray])}  inverted style={{'backgroundColor': backgroundColor, 'color': 'black', 'cursor': 'pointer', 'textAlign': 'center', 'width': '300px', 'marginLeft': 'auto', 'marginRight': 'auto'}}>Platz {place}</Segment>
            </Grid.Column>
        )
    };

    render() {
        return (
            <Grid centered>
                {!this.state.isLoading && this.mounted &&
                <React.Fragment>
                    <Grid.Row>
                    <Grid.Column width={2}>
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <Segment style={{'marginLeft': 'auto', 'marginRight': 'auto', 'backgroundColor': '#5D5C61', 'color': 'white', 'textAlign': 'center', 'fontSize': '36px'}}>Unsere Top 3 Filme</Segment>
                        </Grid.Column>
                        <Grid.Column width={2}>
                        </Grid.Column>
                    </Grid.Row>
                    <Divider hidden/>
                    <Grid.Row centered>
                        <Grid.Column width={2}>
                        </Grid.Column>
                        {this.returnColumn(0)}
                        {this.returnColumn(1)}
                        {this.returnColumn(2)}
                        <Grid.Column width={2}>
                        </Grid.Column>
                    </Grid.Row>
                </React.Fragment>
                }
            </Grid>
        )
    }
}

export default MostPopularFilms;