import * as React from "react";
import {Icon, Button, Grid, Dimmer, Loader, Form, Message, Table} from "semantic-ui-react";
var m = require('moment');

interface preOrdersAdminState {
    isLoading: boolean,
    preOrders: Array<{}>
}

class PreOrdersAdmin extends React.Component<{}, preOrdersAdminState> {

    private mounted: boolean = false;

    constructor(props: any) {
        super(props);

        this.state = {
            isLoading: false,
            preOrders: []
        }
    }

    async componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    getPreOrders = async () => {
        if (this.mounted) { this.setState({isLoading: true})}
        try {
            //get  preOrders


            if (this.mounted) {
                this.setState({
                    preOrders: []
                })
            } 
        } catch {

        }
        if (this.mounted) { this.setState({isLoading: false})}
    } 

    markAsPaid = async () => {
        try {
            //send to backend
            //getPreOrders function again
            this.getPreOrders();

        } catch {

        }
        
    }

    renderMarkedAsPaidButton = () => {
        return (
            <Button color="red" onClick={() => this.markAsPaid()}>
                Bezahlt
            </Button>
        )
    } 

    render() {
        return (
            <React.Fragment>
                {!this.state.isLoading && this.state.preOrders.length !== 0 && 
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={3}>{('pages.logs.table.object')}</Table.HeaderCell>
                            <Table.HeaderCell width={2}>{('pages.logs.table.system')}</Table.HeaderCell>
                            <Table.HeaderCell width={1}>{('pages.logs.table.log_type')}</Table.HeaderCell>
                            <Table.HeaderCell width={2}>{('pages.logs.table.user')}</Table.HeaderCell>
                            <Table.HeaderCell width={6}>{('pages.logs.table.short_info')}</Table.HeaderCell>
                            <Table.HeaderCell width={2}></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.state.preOrders.map((item, index) => (
                            <Table.Row key={index}>
                                <Table.Cell width={3}>1</Table.Cell>
                                <Table.Cell width={2}>2</Table.Cell>
                                <Table.Cell width={1}>3</Table.Cell>
                                <Table.Cell width={2}>4</Table.Cell>
                                <Table.Cell width={6}>5</Table.Cell>
                                <Table.Cell width={2}>{this.renderMarkedAsPaidButton()}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
                }                
            
                {this.state.preOrders.length === 0 && 
                    <Message
                        header="Keine Vorbestellungen gefunden."
                        content="Es wurden bisher keine Vorbestellungen getätigt."
                        style={{'width': '100%'}}
                    />
                }
            </React.Fragment>
           
        )
    }
}

export default PreOrdersAdmin;




