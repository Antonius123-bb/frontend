import * as React from "react";
import {Segment, Menu, Icon} from "semantic-ui-react";
import DeletePresentation from "./DeletePresentation";
import NewPresentation from "./NewPresentation";
import PreOrdersAdmin from "./PreOrdersAdmin";
import UpdatePresentation from "./UpdatePresentation";


/*
* The Admin Container to see not payed orders or create new presentations
*/

interface adminDetailsState {
    isLoading: boolean,
    activeAdminMenuItem: string
}

class AdminDetails extends React.Component<{}, adminDetailsState> {

    private mounted: boolean = false;

    constructor(props: any) {
        super(props);

        this.state = {
            isLoading: false,
            activeAdminMenuItem: 'orders'
        }
    }

    async componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    handleAdminMenuItemClick = (e: any, { name }: any) => {
        this.setState({ activeAdminMenuItem: name })
    }

    render() {
        const activeAdminMenuItem = this.state.activeAdminMenuItem;

        return (
            <React.Fragment>
                {/*menu to switch between orders and create presentations*/}
                <Menu attached='top' tabular>
                    <Menu.Item
                    name='orders'
                    active={activeAdminMenuItem === 'orders'}
                    onClick={this.handleAdminMenuItemClick}>
                        <Icon name='eye'/>
                        Vorbestellungen einsehen
                    </Menu.Item>
                    <Menu.Item
                    name='presentations'
                    active={activeAdminMenuItem === 'presentations'}
                    onClick={this.handleAdminMenuItemClick}>
                        <Icon name='plus'/>
                        Vorstellungen anlegen 
                    </Menu.Item>
                    <Menu.Item
                    name='updatePresentation'
                    active={activeAdminMenuItem === 'updatePresentation'}
                    onClick={this.handleAdminMenuItemClick}>
                        <Icon name='edit'/>
                        Vorstellungen bearbeiten 
                    </Menu.Item>
                    <Menu.Item
                    name='deletePresentation'
                    active={activeAdminMenuItem === 'deletePresentation'}
                    onClick={this.handleAdminMenuItemClick}>
                        <Icon name='trash'/>
                        Vorstellungen löschen 
                    </Menu.Item>
                </Menu>
                <Segment attached='bottom'>  
                    {/*handler to return the correct container*/}                              
                    {activeAdminMenuItem === 'orders' &&
                        <PreOrdersAdmin/>
                    }
                    {activeAdminMenuItem === 'presentations' &&
                        <NewPresentation />
                    }
                    {activeAdminMenuItem === 'updatePresentation' &&
                        <UpdatePresentation />
                    }
                    {activeAdminMenuItem === 'deletePresentation' &&
                        <DeletePresentation />
                    }
                </Segment>
            </React.Fragment>
            
        )
    }
}

export default AdminDetails;




