import * as React from "react";
import {Image, Button, Grid, List, Divider, Message, Popup} from "semantic-ui-react";
import TopMenu from "../../menus/public/TopMenu";
import presentationsService from "../../../services/presentationsService";
import { DateInput } from "semantic-ui-calendar-react";

const m = require('moment');

class MovieDetail extends React.Component<{location: any, history: any}, {movie: any, presentations: any, initialPresentations: any, date: string}> {
    
    private mounted: boolean = false;

    constructor(props: any) {
        super(props);

        this.state = {
            movie: this.props.location.state.movie,
            presentations: [{}],
            initialPresentations: [{}],
            date : ""
        };
    }

    async componentDidMount() {
        this.mounted = true;

        window.scrollTo(0, 0);

        const getPresentationById = await presentationsService.getPresentationByMovieId(this.state.movie.filmid);

        if(this.mounted) {
            this.setState({
                presentations: getPresentationById.data,
                initialPresentations: getPresentationById.data,
            })
        }
    }

    componentWillUnmount(): void {
        this.mounted = false;
    }

    async componentDidUpdate(prevProps) {
        if(prevProps != this.props) {
            this.setState({
                movie: this.props.location.state.movie
            })

            const getPresentationById = await presentationsService.getPresentationByMovieId(this.props.location.state.movie.filmid);

            if(this.mounted) {
                this.setState({
                    presentations: getPresentationById.data,
                    initialPresentations: getPresentationById.data,
                })
            }
        }
    }

    pushToPresentationDetailPage = (presentation) => {
        this.props.history.push({
            pathname: '/presentation/'+presentation['vorstellungsid']
        })
    }

    
    search = async (date) => {

        if(date.length === 0) {

            if(this.mounted) {
                this.setState({
                    presentations: this.state.initialPresentations
                })
            }
        } else {
            let presentations = [];
    
            this.state.initialPresentations.map((pres) => {
                if(m(pres['vorstellungsbeginn']).format("DD-MM-YYYY") === date) {
                    presentations.push(pres);
                }
            })
    
            if(this.mounted) {
                this.setState({
                    presentations: presentations
                })
            }
        }
    }

    render() {

        const m = require('moment');

        return (
            <React.Fragment>
                <TopMenu refreshCart={0} history={this.props.history}/>

                <Grid centered style={{'marginLeft':'150px', 'marginRight':'150px'}}>
                    <Grid.Row columns="2">
                        <Grid.Column width="10" floated="right">
                            <h2>{this.state.movie['name']}</h2>
                            <p>FSK: {this.state.movie['fsk']} Filmstart: {m(this.state.movie['filmstart']).format("DD.MM.YYYY")} Laufzeit: {this.state.movie['dauer']} Min.</p>
                            <p style={{'lineHeight': '1.9'}}>{this.state.movie['beschreibung']}</p>
                            <List>
                                <List.Item>Filstart: {m(this.state.movie['filmstart']).format("DD.MM.YYYY")}</List.Item>
                                <List.Item>FSK: {this.state.movie['fsk']}</List.Item>
                                <List.Item>Länge: {this.state.movie['dauer']}</List.Item>
                                <List.Item>Land: {this.state.movie['land']}</List.Item>
                            </List>
                        </Grid.Column>
                        <Grid.Column width="6">
                            <Image style={{'float': 'right'}} size="medium" src={this.state.movie['bild_link']}/>
                        </Grid.Column>
                    </Grid.Row>

                    <Divider />

                    <Grid.Row>

                    <DateInput
                        animation={null}
                        name="date"
                        placeholder="Datum wählen"
                        value={this.state.date}
                        iconPosition="left"
                        onChange={(event, {value}) => {this.search(value), this.setState({ date: value.toString() })}}
                        minDate={new Date()}
                        clearable
                        />

                    </Grid.Row>

                    <Grid.Row columns={3}>
                        <Grid.Column width={1}></Grid.Column>
                        <Grid.Column width={14} style={{'textAlign': 'center'}}>
                            {this.state.presentations && this.state.presentations.length === 0 &&
                                <Message 
                                color='grey'
                                header='Keine Vorstellungen gefunden.'
                                content='An dem gewählten Datum zeigen wir die gewünschte Vorstellung leider nicht.'
                                />
                            }

                            {this.state.presentations && this.state.presentations.length > 0 && this.state.presentations.slice(0,7).map((pres, index) => {
                                return (
                                    <div style={{'float': 'left', 'marginRight': '8px'}}>
                                        <b><span style={{'fontSize': '18px'}}>{pres['vorstellungsbeginn'] && m(pres['vorstellungsbeginn']).locale('de').format("dddd")},&nbsp; 
                                        {pres['vorstellungsbeginn'] && m(pres['vorstellungsbeginn']).format("DD.MM")}</span></b><br/>
                                        {pres['3d'] ?
                                            <Popup content='3D Vorstellung' position='top center' trigger={
                                                <Button onClick={() => this.pushToPresentationDetailPage(pres)} inverted color={'youtube'}>
                                                    {pres['vorstellungsbeginn'] && m(pres['vorstellungsbeginn']).locale('de').format("HH:mm")}
                                                </Button>
                                            } /> 
                                            :
                                            <Button onClick={() => this.pushToPresentationDetailPage(pres)} inverted color={'facebook'}>
                                                {pres['vorstellungsbeginn'] && m(pres['vorstellungsbeginn']).locale('de').format("HH:mm")}
                                            </Button>
                                        }
                                    </div>
                                )
                            })}
                        </Grid.Column>
                        <Grid.Column width={1}></Grid.Column>
                    </Grid.Row>

                    <Divider />

                    <Grid.Row columns="1">
                        <Grid.Column style={{'textAlign': 'center'}}>
                            <iframe width="700" height="540"
                            src={"https://www.youtube.com/embed/"+this.state.movie['trailer_youtube_id']+"?autoplay=1"}>
                            </iframe>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </React.Fragment>
        )
    }
}

export default MovieDetail;