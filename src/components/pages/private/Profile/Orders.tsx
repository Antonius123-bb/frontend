import moment from "moment";
import * as React from "react";
import { Button, Form, Grid, Icon, Message, Table } from "semantic-ui-react";
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
    orderOnEdit: string,
    cancelSuccess: boolean,
    errorMessage: string,
    notDataAvailable: boolean
}

class Orders extends React.Component<{}, ordersState> {

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

    generateRecentOrdersWithAdditionalData = async () => {
        try {
            if(this.mounted){
                this.setState({isLoading: true})

                const response = await orderService.getOrdersByUser(JSON.parse(localStorage.getItem(USER_COOKIE_INFO)).id);

                if (response.data.data.length != 0){
                    

                    let moviesAll = await movieService.getAllMovies();
                    let PresentationsAll = await presentationsService.getAllPresentations();
                    const movies = moviesAll.data.data;
                    const recentOrders = response.data.data;
                    const allPresentations = PresentationsAll.data.data;

                    recentOrders.map((ord) => {
                        ord.movieName = '';
                        ord.movieDuration = 0;
                        ord.roomName;
                        ord.presentationStart = ''
                    })
            
                    recentOrders.forEach((pres) => {
                        let allPresIndex = allPresentations.findIndex(allPres => allPres._id === pres.presentationId);
                        if (allPresIndex === -1){
                            this.setState({
                                errorMessage: "Ein unbekannter Fehler ist aufgetreten."
                            })
                        } else {
                            pres.roomName = getRoomNameById(allPresentations[allPresIndex].roomId);
                            pres.presentationStart = allPresentations[allPresIndex].presentationStart;
                            let movieIndex = movies.findIndex(mov => mov._id === allPresentations[allPresIndex].movieId);
                            let movieData = movies[movieIndex];
                            let movieName;
                            if (movieData["originalTitle"] != ""){
                                movieName= movieData["originalTitle"]
                            } else {
                                movieName= movieData["title"]
                            }
                            pres.movieName = movieName;
                            pres.movieDuration = movieData["duration"];
                        }
                    })


                    this.setState({
                        modifiedOrderData: recentOrders
                    })

                } else {
                    this.setState({
                        notDataAvailable: true
                    })
                }

                this.setState({isLoading: false})

            }

        } catch (e){
            console.log("HALLO ", e)
        }
    }


    getPresentationDetails = async (presId) => {
        try {
            const response =  await presentationsService.getPresentationById(presId);
            return response.data.data
        } catch {

        }
    }

    getRecentOrders = async () => {
        if (this.mounted) { this.setState({isLoading: true}) }
        try {
            
            const response = await orderService.getOrdersByUser(JSON.parse(localStorage.getItem(USER_COOKIE_INFO)).id);

            if (this.mounted) {
                this.setState({
                    recentOrders: response.data.data
                })
            } 
        } catch {

        }
        if (this.mounted) { this.setState({isLoading: false})}
    } 

    cancelOrder = async () => {
        try {
            if (this.mounted) {

                const response = await orderService.cancelOrder(this.state.orderOnEdit);
                this.setState({cancelSuccess: true, editMode: false})
                this.generateRecentOrdersWithAdditionalData();

            }
        } catch (e){
            this.setState({editMode: false, cancelSuccess: false, errorMessage: e})
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    getMovieByPresId = async (presId) => {
        try {
            if(this.mounted){
                this.setState({
                    isLoading: true
                })
            }
            const response = await this.getPresentationDetails(presId);
            const movie = await movieService.getMovieById(response.movieId);
            let movieName = movie.data.data["originalTitle"];
            if (movieName === "") {
                movieName = movie.data.data["title"]
            }
            if(this.mounted){
                this.setState({
                    isLoading: false
                })
            }
            return movieName.toString();
        }catch {

        }
    }

    renderEditButton = (orderId) => {
        try {
            return (
                <Button onClick={() => this.setState({editMode: true, orderOnEdit: orderId, cancelSuccess: false, errorMessage: ''})}>
                    Stornieren
                </Button>
            )
        } catch {

        }
    }

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
                        <Table.Row key={index} onClick={() => this.setState({editMode: true, orderOnEdit: item["_id"], cancelSuccess: false, errorMessage: ''})}>
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
                {this.state.editMode && !this.state.isLoading &&
                <Grid>
                    <Grid.Row>
                        <Grid.Column floated="left">
                        <Button color='green' basic icon labelPosition='left' onClick={() => this.setState({editMode: false, orderOnEdit: ''})}>
                            Zurück
                            <Icon name='backward'/>
                        </Button>  

                        </Grid.Column>
                        <Grid.Column floated="right">
    
                        <Button color='red' icon labelPosition='left' basic onClick={() => this.cancelOrder()}>
                            <Icon name='save'/>
                            Bestellung stornieren
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




