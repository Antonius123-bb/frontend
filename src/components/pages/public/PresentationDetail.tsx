import * as React from "react";
import {Icon, Image, Button, Grid, Divider, Header} from "semantic-ui-react";
import presentationsService from '../../../services/presentationsService';
import movieService from '../../../services/movieService';
import TopMenu from "../../menus/public/TopMenu";
import { CART_COOKIE } from '../../../constants';
import SeatPicker from "../../seat-picker/SeatPicker";
var m = require('moment');

class PresentationDetail extends React.Component<{match: any, history: any}, {loading: boolean, presentation: any, movie: any, cost: number, costList: any, showButton: boolean, selectedSeats: Array<number>}> {

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
        this.mounted = true;

        window.scrollTo(0, 0);

        const id = this.props.match.params.id;

        const getPresentationById = await presentationsService.getPresentationById(id);

        let movies = await movieService.getAllMovies();

        const movie = movies.data.filme.find(x => x.filmid === getPresentationById.data.filmid);

        if(this.mounted) {
            this.setState({
                presentation: getPresentationById.data,
                movie: movie
            })
        }

        console.log(this.state.presentation);
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    setCosts = (cost, costList) => {

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
                movieName: this.state.movie.name,
                movieImage: this.state.movie.bild_link,
                presentationId: this.props.match.params.id
            };
            cartArr2.push(cartObj);
            localStorage.setItem(CART_COOKIE, JSON.stringify(cartArr2));
        } else {
            const cartObj = {
                selectedSeats: this.state.selectedSeats,
                cost: this.state.cost,
                costList: this.state.costList,
                movieName: this.state.movie.name,
                movieImage: this.state.movie.bild_link,
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
                movieName: this.state.movie.name
            }
        })
    }

    render() {

        const { loading } = this.state;

        return (
            <React.Fragment>
                <TopMenu refreshCart={/*this.state.refreshCart*/0} history={this.props.history} />

                <Button style={{'marginLeft':'10px'}} icon labelPosition='left' onClick={() => window.history.back()}>
                    <Icon name="arrow left"/>
                    Zurück
                </Button>

                <Grid centered style={{'marginLeft':'10px', 'marginTop': '10px', 'marginRight':'10px'}}>

                    <Grid.Row columns="2">
                        <Grid.Column width="10">
                            {this.state.movie && this.state.presentation &&
                            <React.Fragment>
                                <p style={{'fontSize': '20px'}}>{m(this.state.presentation['vorstellungsbeginn']).format("HH:mm")} Uhr am {m(this.state.presentation['vorstellungsbeginn']).format("DD.MM.yyyy")}</p>
                                <Header as="h2">Tickets reservieren für: <span style={{'textDecoration': 'underline'}}>{this.state.movie.name}</span> {this.state.presentation['3d'] ? "(3D)" : ""}</Header>
                            </React.Fragment>
                            }
                            <p style={{'fontSize': '20px'}}>{this.state.movie['kurze_beschreibung']}.</p>
                            <ul style={{'lineHeight': '1.9', 'fontSize': '18px'}}>
                                <li>Länge: {this.state.movie['dauer']} Minuten</li>
                                <li>FSK: {this.state.movie['fsk']}</li>
                                <li>Saal: {this.state.presentation && this.state.presentation['saalName']}</li>
                            </ul>
                        </Grid.Column>
                        <Grid.Column width="4">
                            <Image style={{'float': 'center'}} size="medium" src={this.state.movie['bild_link']}/>
                        </Grid.Column>
                    </Grid.Row>

                    <Divider />

                    <Grid.Row columns="2">
                        <Grid.Column width="10">
                            <Header style={{'lineHeight': '3'}} as="h3">Bitte wählen Sie Ihre Plätze aus.</Header>
                            {this.state.presentation != null &&
                                <div style={{'borderRadius': '20px', 'marginLeft': '35px', 'width': this.state.presentation.width * 2, 'background': 'grey', 'height': '60px', 'textAlign': 'center'}}>
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
                                <SeatPicker seats={this.state.presentation} setCosts={this.setCosts} setButton={this.setButton}/>
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
        )
    }
}

export default PresentationDetail;