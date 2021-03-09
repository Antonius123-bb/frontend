import * as React from "react";
import { Button, Message, Table } from "semantic-ui-react";
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
        this.getUserInfos();
        this.getRecentOrders();
    }

    getPresentationDetails = async (vorstellungsid) => {
        return await presentationsService.getPresentationById(vorstellungsid)
    }

    getUserInfos = async () => {
        return await userService.getUserinfos();
    }

    getRecentOrders = () => {
        if (this.mounted) { this.setState({isLoading: true}) }
        try {
            
            let presentationDetails;

            const userInfos = this.getUserInfos();

            // const orderDetails = userInfos.data.bestellungen.forEach((item, index) => {
            //     presentationDetails = this.getPresentationDetails(item["vorstellungsid"])
            //     console.log("TEst ",presentationDetails)
            //     // return (
            //     //     {

            //     //     }
            //     // )
            // })

            if (this.mounted) {
                this.setState({
                    //recentOrders: response.data.bestellungen
                })
            } 
        } catch {

        }
        if (this.mounted) { this.setState({isLoading: false})}
    } 

    componentWillUnmount() {
        this.mounted = false;
    }

    renderPaidButton = (bezahlt) => {
        return (
            <Button color={bezahlt ? "green" : "red"}>
                {bezahlt ? "bezahlt" : "nicht bezahlt"}
            </Button>
        )
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
                            <Table.HeaderCell width={2}></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                    {this.state.recentOrders.map((item, index) => (
                        <Table.Row key={index}>
                            <Table.Cell width={2}>{item['anrede']}</Table.Cell>
                            <Table.Cell width={3}>{item['name']}</Table.Cell>
                            <Table.Cell width={5}>{item['strasse']}</Table.Cell>
                            <Table.Cell width={3}>{item['plz']}</Table.Cell>
                            <Table.Cell width={2}>{this.renderPaidButton(item['bezahlt'])}</Table.Cell>
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




