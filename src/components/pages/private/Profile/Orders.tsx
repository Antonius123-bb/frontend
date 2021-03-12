import * as React from "react";
import { Button, Message, Table } from "semantic-ui-react";
import { USER_COOKIE_INFO } from "../../../../constants";
import orderService from "../../../../services/orderService";
import presentationsService from "../../../../services/presentationService";
import userService from "../../../../services/userService";

//The Orders Container to watch the latest orders
//TODO: create orders page in modal

interface ordersState {
    isLoading: boolean,
    recentOrders: Array<{}>
}

class Orders extends React.Component<{}, ordersState> {

    private mounted: boolean = false;

    constructor(props: any) {
        super(props);

        this.state = {
            isLoading: false,
            recentOrders: []
        }
    }

    async componentDidMount() {
        this.mounted = true;

        //get recent orders from user
        this.getRecentOrders();
    }

    getPresentationDetails = async (vorstellungsid) => {
        return await presentationsService.getPresentationById(vorstellungsid)
    }

    getRecentOrders = async () => {
        if (this.mounted) { this.setState({isLoading: true}) }
        try {
            
            const response = await orderService.getOrdersByUser(JSON.parse(localStorage.getItem(USER_COOKIE_INFO)).id);
            console.log("RESP ", response)

            if (this.mounted) {
                this.setState({
                    recentOrders: response.data.data
                })
            } 
        } catch {

        }
        if (this.mounted) { this.setState({isLoading: false})}
    } 

    cancelOrderById = async (orderId) => {
        try {
            if (this.mounted) {

                const response = await orderService.cancelOrder(orderId);

            }
        } catch {

        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    render() {

        return (
           <React.Fragment>
               {this.state.recentOrders && this.state.recentOrders.length != 0 && !this.state.isLoading &&
                <Table selectable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={2}>Anrede</Table.HeaderCell>
                            <Table.HeaderCell width={3}>Name</Table.HeaderCell>
                            <Table.HeaderCell width={5}>Straße</Table.HeaderCell>
                            <Table.HeaderCell width={3}>Postleitzahl</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                    {this.state.recentOrders.map((item, index) => (
                        <Table.Row key={index}>
                            <Table.Cell width={2}>{item['anrede']}</Table.Cell>
                            <Table.Cell width={3}>{item['name']}</Table.Cell>
                            <Table.Cell width={5}>{item['strasse']}</Table.Cell>
                            <Table.Cell width={3}>{item['plz']}</Table.Cell>
                        </Table.Row>
                    ))}
                    </Table.Body>
                </Table>
                }
                {this.state.recentOrders.length === 0 &&
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




