import * as React from "react";
import {Icon, Image, Button, Grid, Divider, Header} from "semantic-ui-react";
import presentationsService from '../../../services/presentationService';
import movieService from '../../../services/movieService';
import TopMenu from "../../menus/public/TopMenu";
import { arrayToString, CART_COOKIE, getRoomNameById } from '../../../constants';
import SeatPicker from "../../seat-picker/SeatPicker";
import moment from "moment";
var m = require('moment');

interface PresentationDetailState {
    loading: boolean, 
    presentation: any,
    movie: any, 
    cost: number, 
    costList: any, 
    showButton: boolean, 
    selectedSeats: Array<number>
}

class PresentationDetail extends React.Component<{match: any, history: any}, PresentationDetailState> {

    private mounted: boolean = false;

    constructor(props: any) {
        super(props);

        this.state = {
            loading: false,
            presentation: null,
            movie: {},
            cost: 0,
            costList: null,
            showButton: false,
            selectedSeats: []
        };
    }

    async componentDidMount() {
        try {
            this.mounted = true;
            if (this.mounted){
                this.setState({
                    loading:true
                })
            }
            window.scrollTo(0, 0);
    
            const id = this.props.match.params.id;
    
    
            const getPresentationById = await presentationsService.getPresentationById(id);
    
            let movies = await movieService.getAllMovies();
    
            const movie = movies.data.data.find(x => x._id === getPresentationById.data.data.movieId);

            if(this.mounted) {
                this.setState({
                    presentation: getPresentationById.data.data,
                    movie: movie,
                    loading: false
                })
            }

        } catch {

        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    setCosts = (cost, costList) => {

        console.log("setCosts");

        let costs = [];

        costList.forEach(pos => {
            const index = costs.findIndex(x => x.category === pos.category);

            if(index === -1) {
                costs.push({
                    category: pos.category,
                    cost: pos.price,
                    times: 1
                })
            } else {
                let costObj = costs[index];
                costObj.cost += pos.price;
                costObj.times++;
            }
        })

        if(this.mounted) {
            this.setState({
                cost: cost,
                costList: costs
            })
        }

        console.log(costs)
    }

    setButton = (showButton, selectedSeats) => {
        if(this.mounted) {
            this.setState({
                showButton: showButton,
                selectedSeats: selectedSeats
            })
        }
    }

    pushToCheckout = () => {

        let cart = localStorage.getItem(CART_COOKIE);

        let cartArr = JSON.parse(cart);

        if(cart === null) {
            let cartArr2 = [];
            const cartObj = {
                selectedSeats: this.state.selectedSeats,
                cost: this.state.cost,
                costList: this.state.costList,
                movieName: this.state.movie["originalTitle"] === "" ? this.state.movie["title"] : this.state.movie["originalTitle"],
                movieImage: this.state.movie.posterurl,
                presentationId: this.props.match.params.id
            };
            cartArr2.push(cartObj);
            console.log("1", cartObj);
            localStorage.setItem(CART_COOKIE, JSON.stringify(cartArr2));
        } else {
            const cartObj = {
                selectedSeats: this.state.selectedSeats,
                cost: this.state.cost,
                costList: this.state.costList,
                movieName: this.state.movie["originalTitle"] === "" ? this.state.movie["title"] : this.state.movie["originalTitle"],
                movieImage: this.state.movie.posterurl,
                presentationId: this.props.match.params.id
            };
            cartArr.push(cartObj);
            localStorage.setItem(CART_COOKIE, JSON.stringify(cartArr));
        }

        this.props.history.push({
            pathname: '/checkout',
            state: {
                presentationId: this.props.match.params.id,
                selectedSeats: this.state.selectedSeats,
                cost: this.state.cost,
                costList: this.state.costList,
                movieName: this.state.movie["originalTitle"] === "" ? this.state.movie["title"] : this.state.movie["originalTitle"],
            }
        })
    }

    render() {

        return (
            <React.Fragment>
                <TopMenu refreshCart={/*this.state.refreshCart*/0} history={this.props.history} />

                {!this.state.loading &&
                <React.Fragment>
                    <Button style={{'marginLeft':'10px'}} icon labelPosition='left' basic onClick={() => window.history.back()}>
                        <Icon name="arrow left"/>
                        Zurück
                    </Button>

                    <Grid centered style={{'marginLeft':'10px', 'marginTop': '10px', 'marginRight':'10px'}}>

                        <Grid.Row columns="2">
                            <Grid.Column width="10">
                                {this.state.movie && this.state.presentation &&
                                <React.Fragment>
                                    <p style={{'fontSize': '20px'}}>{m(this.state.presentation['presentationStart']).format("HH:mm")} Uhr am {m(this.state.presentation['presentationStart']).format("DD.MM.yyyy")}</p>
                                    <Header as="h2" style={{'color': 'rgb(85, 122, 149)'}}>Tickets reservieren für: <span style={{'textDecoration': 'underline'}}>{this.state.movie["originalTitle"] === "" ? this.state.movie["title"] : this.state.movie["originalTitle"]}</span> {this.state.presentation['threeD'] ? "(3D)" : ""}</Header>
                                </React.Fragment>
                                }
                                <p style={{'fontSize': '20px'}}>{this.mounted && (this.state.movie["storyline"]).split(" Written by")[0]}</p>
                                <ul style={{'lineHeight': '1.9', 'fontSize': '18px'}}>
                                    <li>Schauspieler: {arrayToString(this.state.movie['actors'])}</li>
                                    <li>Genres: {arrayToString(this.state.movie['genres'])}</li>
                                    <li>Länge: {moment.duration(this.state.movie['duration']).asMinutes()} Minuten</li>
                                    <li>Rating: {this.state.movie['imdbRating']}</li>
                                    <li>{this.state.presentation && getRoomNameById(this.state.presentation['roomId'])}</li>
                                </ul>
                            </Grid.Column>
                            <Grid.Column width="4">
                                <Image style={{'float': 'center'}} size="medium" src={this.state.movie['posterurl']}/>
                            </Grid.Column>
                        </Grid.Row>

                        <Divider />

                        <Grid.Row columns="2">
                            <Grid.Column width="10">
                                <Header style={{'lineHeight': '3', 'color': 'rgb(85, 122, 149)'}} as="h3">Bitte wählen Sie Ihre Plätze aus.</Header>
                                {this.state.presentation != null &&
                                    // 'width': this.state.presentation.width * 2
                                    <div style={{'borderRadius': '20px', 'marginLeft': '35px', 'background': 'grey', 'height': '60px', 'textAlign': 'center'}}>
                                        <br/><span style={{'fontSize': '20px', 'color': 'white'}}>Leinwand</span>
                                    </div>
                                }
                                
                            </Grid.Column>
                            <Grid.Column width="4" verticalAlign="bottom" textAlign="right">
                            
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row columns="2">
                            <Grid.Column width="10">

                                {this.state.presentation != null &&
                                    <SeatPicker seats={this.state.presentation.seats} setCosts={this.setCosts} setButton={this.setButton}/>
                                }

                            </Grid.Column>
                            <Grid.Column width="4" verticalAlign="bottom" textAlign="right">
                                {this.state.costList != null && this.state.costList.map((pos, pIndex) => {
                                    return (
                                        <p key={pIndex}>{pos['category']} * {pos['times']} = {pos['cost']}€</p>
                                    )
                                })}

                                <b><p style={{'fontSize': '20px'}}>Gesamtpreis: {this.state.cost}€ inkl. MwSt.</p></b>
                                
                                <Button onClick={() => this.pushToCheckout()} disabled={!this.state.showButton} style={{'marginTop': '20px'}}>Tickets kaufen</Button>
                            </Grid.Column>
                        </Grid.Row>

                        <Divider />
                        
                    </Grid>

                </React.Fragment>
                
                }
                
            </React.Fragment>
        )
    }
}

export default PresentationDetail;