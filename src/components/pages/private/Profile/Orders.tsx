import moment from "moment";
import * as React from "react";
import { Button, Form, Grid, Icon, Message, Table, Image, List, Divider, Popup } from "semantic-ui-react";
import { getRoomNameById, USER_COOKIE_INFO } from "../../../../constants";
import movieService from "../../../../services/movieService";
import orderService from "../../../../services/orderService";
import presentationsService from "../../../../services/presentationService";
import userService from "../../../../services/userService";

//The Orders Container to watch the latest orders
//TODO: create orders page in modal

interface ordersState {
    isLoading: boolean,
    recentOrders: Array<{}>,
    modifiedOrderData: [],
    editMode: boolean,
    orderOnEdit: Object,
    cancelSuccess: boolean,
    errorMessage: string,
    notDataAvailable: boolean
}

class Orders extends React.Component<{history:any}, ordersState> {

    private mounted: boolean = false;

    constructor(props: any) {
        super(props);

        this.state = {
            isLoading: false,
            recentOrders: [],
            modifiedOrderData: [],
            editMode: false,
            orderOnEdit: '',
            cancelSuccess: false,
            errorMessage: '',
            notDataAvailable: false
        }
    }

    async componentDidMount() {
        this.mounted = true;

        this.generateRecentOrdersWithAdditionalData();
        
    }

    getPresentationDetails = async (id) => {
        try {
            const pres = await presentationsService.getPresentationById(id);
            return pres.data.data;
        } catch{
            this.setState({
                errorMessage: "Ein unbekannter Fehler ist aufgetreten."
            })
        }
    }

    getMovieDetails = async (id) => {
        try {
            const mov = await movieService.getMovieById(id);
            return mov.data.data;
        } catch{
            this.setState({
                errorMessage: "Ein unbekannter Fehler ist aufgetreten."
            })
        }
    }

    generateRecentOrdersWithAdditionalData = async () => {
        try {
            if(this.mounted){
                this.setState({isLoading: true})

                const response = await orderService.getOrdersByUser(JSON.parse(localStorage.getItem(USER_COOKIE_INFO)).id);

                if (response.data.data.length != 0){
                    
                    const recentOrders = response.data.data;

                    let ordersToShow:any = [];

                    for(const ord of recentOrders) {

                        const pres = await this.getPresentationDetails(ord.presentationId);
                        const mov = await this.getMovieDetails(pres.movieId);
                    
                        ord.movieDuration = mov.duration;
                        ord.posterurl = mov.posterurl;
                        ord.movieId = mov._id;
                        ord.releaseYear = moment(mov.releaseDate).format('YYYY')
                        ord.presentationStart = pres.presentationStart;
                        ord.presentationEnd = pres.presentationEnd;
                        ord.roomName = getRoomNameById(pres.roomId);

                        if (mov.originalTitle === ""){
                            ord.movieName= mov.title
                        } else {
                            ord.movieName= mov.originalTitle
                        }

                        ordersToShow.push(ord);
                    }

                    if(this.mounted) {
                        this.setState({
                            modifiedOrderData: ordersToShow.sort((a, b) => b.presentationStart - a.presentationStart)
                        })
                    }
                } else {
                    if(this.mounted) {
                        this.setState({
                            notDataAvailable: true
                        })
                    }
                }
                if(this.mounted) {
                    this.setState({isLoading: false})
                }
            }

        } catch{
            if(this.mounted) {
                this.setState({
                    errorMessage: "Ein unbekannter Fehler ist aufgetreten."
                })
            }
        }
    }

    cancelOrder = async () => {
        try {
            if (this.mounted) {

                const response = await orderService.cancelOrder(this.state.orderOnEdit['_id']);
                this.setState({cancelSuccess: true, editMode: false, orderOnEdit: ''})
                this.generateRecentOrdersWithAdditionalData();

            }
        } catch {
            this.setState({
                errorMessage: "Ein unbekannter Fehler ist aufgetreten."
            })
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    renderEditButton = (orderId) => {
        try {
            const order = this.getOrderById(orderId);
            let orderInPast;
            if (order['presentationStart'] < (new Date()).getTime()){
                orderInPast = true
            }
            if (orderInPast){
                return (
                    <Popup position='top center' content='Die Bestellung kann nicht mehr storniert werden.' trigger={
                        <Button style={{'cursor': 'default'}}>
                            Stornieren
                        </Button>
                    } />
                )
            } else {
                return (
                    <Button color='green' onClick={() => this.setState({editMode: true, orderOnEdit: order, cancelSuccess: false, errorMessage: ''})}>
                        Stornieren
                    </Button>
                )
            }
        } catch {

        }
    }

    getOrderById = (orderId) => {
        try {
            let temp:any = this.state.modifiedOrderData;
            let orderOnEdit = temp.find(obj => obj['_id'] === orderId);
            console.log("ORDER ON EDIT ", orderOnEdit)
            return orderOnEdit;
        } catch {
            return ''
        }
    }

    getPresentationString = (presentationStart, presentationEnd, movieDuration) => {
        try {
            return moment(presentationStart).format('DD.MM.YYYY') + ' ' + moment(presentationStart).format('HH:mm') + 'Uhr - ' + moment(presentationEnd).format('HH:mm') + 'Uhr (' +  moment.duration(movieDuration).asMinutes() + " Minuten)"
        } catch {

        }
    }

    pushToMovieDetailPage = () => {
        try {
            const movieString = (this.state.orderOnEdit['movieName'].replace(/ /g, '-')).toLowerCase();
            if(!((window.location.href).includes(movieString))){
                this.props.history.push({
                    pathname: '/movie',
                    search: '?name='+movieString,
                    state: { movieId: this.state.orderOnEdit['movieId'] }
                })
            }

        } catch {

        }
    };

    render() {

        return (
           <React.Fragment>
               {!this.state.notDataAvailable && !this.state.isLoading && !this.state.editMode &&
                <Table selectable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={3}>Film</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Anzahl Tickets</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Datum</Table.HeaderCell>
                            <Table.HeaderCell width={3}>Dauer</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Saal</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Bezahlmittel</Table.HeaderCell>
                            <Table.HeaderCell width={2}></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                    {this.state.modifiedOrderData.map((item, index) => (
                        <Table.Row key={index}>
                            <Table.Cell width={3}>{item['movieName']}</Table.Cell>
                            <Table.Cell width={2}>{item['seats']['length']}</Table.Cell>
                            <Table.Cell width={2}>{moment(item["presentationStart"]).format("DD.MM.YYYY HH:mm")}</Table.Cell>
                            <Table.Cell width={3}>{moment.duration(item["movieDuration"]).asMinutes()} Min.</Table.Cell>
                            <Table.Cell width={2}>{item['roomName']}</Table.Cell>
                            <Table.Cell width={2}>{item["payment"] === "bar" ? "Barzahlung" : "PayPal"}</Table.Cell>
                            <Table.Cell width={2}>{this.renderEditButton(item["_id"])}</Table.Cell>
                        </Table.Row>
                    ))}
                    </Table.Body>
                </Table>
                }

                {this.state.editMode && !this.state.isLoading && !this.state.notDataAvailable && this.state.orderOnEdit != '' &&
                <Grid centered>
                    <Grid.Row style={{'marginLeft':'50px', 'marginRight':'50px'}} columns={2}>
                        <Grid.Column floated="left" width={4}>
                            <Image style={{'cursor': 'pointer'}} src={this.state.orderOnEdit['posterurl']} onClick={() => this.pushToMovieDetailPage()}/>
                            <div onClick={() => this.pushToMovieDetailPage()} style={{'textAlign': 'center', 'fontWeight': 'bold', 'marginTop': '10px', 'cursor': 'pointer'}}>{this.state.orderOnEdit['movieName']} ({this.state.orderOnEdit['releaseYear']})</div>
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <List style={{'marginTop': '50px'}}>
                                <List.Item key='1'>Vorstellungszeit: {this.getPresentationString(this.state.orderOnEdit['presentationStart'], this.state.orderOnEdit['presentationEnd'], this.state.orderOnEdit['movieDuration'])}</List.Item>
                                <Divider/>
                                <List.Item key='2'>Zeitpunkt der Bestellung: {moment(this.state.orderOnEdit["time"]).format("DD.MM.YYYY HH:mm")} </List.Item>
                                <Divider/>
                                <List.Item key='3'>Anzahl Tickets: {this.state.orderOnEdit['seats']['length']}</List.Item>
                                <Divider/>
                                <List.Item key='4'>{this.state.orderOnEdit['roomName']}</List.Item>
                                <Divider/>
                                <List.Item key='5'>Bezahlmethode: {this.state.orderOnEdit['payment'] === 'bar' ? 'Barzahlung' : 'PayPal'}</List.Item>
                                <Divider/>
                            </List>
                        </Grid.Column>

                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column floated="left">
                        <Button color='green' basic icon labelPosition='left' onClick={() => this.setState({editMode: false, orderOnEdit: ''})}>
                            Zurück
                            <Icon name='backward'/>
                        </Button>  

                        </Grid.Column>
                        <Grid.Column>
    
                        <Button color='red' floated="right" icon labelPosition='left' basic onClick={() => this.cancelOrder()}>
                            <Icon name='cancel'/>
                            Stornieren
                        </Button> 

                        </Grid.Column>                                      
                    </Grid.Row>
                </Grid>                 
                }
                {this.state.cancelSuccess && !this.state.editMode && !this.state.isLoading && 
                // TODO: Genauen Rückersttaungs betrag anzeigen in message
                <Message
                    success
                    header="Bestellung storniert."
                    content="Die Bestellung wurde erfolgreich storniert, das Geld wird auf das ursprüngliche Zahlungsmittel erstattet."
                />
                }
                {this.state.errorMessage != '' && !this.state.editMode && !this.state.isLoading &&
                // TODO: Genauen Rückersttaungs betrag anzeigen in message
                <Message
                    error
                    header="Fehler."
                    content={this.state.errorMessage}
                />
                }
                {this.state.notDataAvailable && !this.state.editMode && !this.state.isLoading && this.mounted &&
                <Message
                    header="Keine Bestellungen gefunden."
                    content="Es wurden bisher keine Bestellungen getätigt."
                />
                }
           </React.Fragment>
        )
    }
}

export default Orders;