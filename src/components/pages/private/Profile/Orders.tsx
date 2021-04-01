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
                        ord.presentationStart = pres.presentationStart;
                        ord.roomName = getRoomNameById(pres.roomId);

                        if (mov.title != ""){
                            ord.movieName= mov.title
                        } else {
                            ord.movieName= mov.title
                        }

                        ordersToShow.push(ord);
                    }

                    if(this.mounted) {
                        this.setState({
                            modifiedOrderData: ordersToShow
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

                const response = await orderService.cancelOrder(this.state.orderOnEdit);
                this.setState({cancelSuccess: true, editMode: false})
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


// Mein Ansatz
// generateRecentOrdersWithAdditionalData = async () => {
//     try {
//         if(this.mounted){
//             this.setState({isLoading: true})

//             const response = await orderService.getOrdersByUser(JSON.parse(localStorage.getItem(USER_COOKIE_INFO)).id);
//             console.log("RS ", response)

//             if (response.data.data.length != 0){
                

//                 let moviesAll = await movieService.getAllMovies();

//                 let allPresentationsByUser = [];
                
//                 response.data.data.map(async item => {
//                     const allPresByUser = await presentationsService.getPresentationById(item.presentationId);
//                     // const tempObj = {
//                     //     basicPrice: allPresByUser.data.data.basicPrice,
//                     //     movieId: allPresByUser.data.data.movieId,
//                     //     presentationEnd: allPresByUser.data.data.presentationEnd,
//                     //     presentationStart: allPresByUser.data.data.presentationStart,
//                     //     roomId: allPresByUser.data.data.roomId,
//                     //     seats: allPresByUser.data.data.roomId,
//                     //     _id: allPresByUser.data.data._id
//                     // }
//                     allPresentationsByUser.push(allPresByUser.data.data)
//                 });
//                 const movies = moviesAll.data.data;
//                 const recentOrders = response.data.data;
//                 const allPresentations = allPresentationsByUser;

//                 recentOrders.map((ord) => {
//                     ord.movieName = '';
//                     ord.movieDuration = 0;
//                     ord.roomName;
//                     ord.presentationStart = ''
//                 })

//                 console.log("REC ", recentOrders);
//                 console.log("ALLPresentations ", allPresentations)

//                 recentOrders.forEach((pres) => {
//                     console.log("PRES ", pres)
//                     console.log("TEST ", allPresentations[0])
//                     // allPresentations.map((allPres) => {
//                     //     console.log("ALLPRESS ", allPres)
//                     // })
//                     let allPresIndex = allPresentations.findIndex(allPres => allPres._id === pres.presentationId);
//                     if (allPresIndex === -1){
//                         this.setState({
//                             errorMessage: "Ein unbekannter Fehler ist aufgetreten."
//                         })
//                     } else {
//                         pres.roomName = getRoomNameById(allPresentations[allPresIndex].roomId);
//                         pres.presentationStart = allPresentations[allPresIndex].presentationStart;
//                         let movieIndex = movies.findIndex(mov => mov._id === allPresentations[allPresIndex].movieId);
//                         let movieData = movies[movieIndex];
//                         let movieName;
//                         if (movieData["originalTitle"] != ""){
//                             movieName= movieData["originalTitle"]
//                         } else {
//                             movieName= movieData["title"]
//                         }
//                         pres.movieName = movieName;
//                         pres.movieDuration = movieData["duration"];
//                     }
//                 })


//                 this.setState({
//                     modifiedOrderData: recentOrders
//                 })

//             } else {
//                 this.setState({
//                     notDataAvailable: true
//                 })
//             }

//             this.setState({isLoading: false})

//         }

//     } catch (e){
//         console.log("HALLO ", e)
//     }
// }