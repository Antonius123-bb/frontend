import * as React from "react";
import {Segment, Menu, Icon} from "semantic-ui-react";
import DeletePresentation from "./DeletePresentation";
import NewPresentation from "./NewPresentation";
import UpdatePresentation from "./UpdatePresentation";

// The Admin Container

interface adminDetailsState {
    activeAdminMenuItem: string
}

class AdminDetails extends React.Component<{}, adminDetailsState> {

    private mounted: boolean = false;

    constructor(props: any) {
        super(props);

        this.state = {
            activeAdminMenuItem: 'presentations'
        }
    }

    async componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    handleAdminMenuItemClick = (e: any, { name }: any) => {
        try {
            if (this.mounted){
                this.setState({ activeAdminMenuItem: name })
            }
        } catch (e) {
            console.log("Error ",e)
        }
    }

    render() {
        const activeAdminMenuItem = this.state.activeAdminMenuItem;
        return (
            <React.Fragment>
                {/*menu to switch between create, update and delete presentations*/}
                <Menu attached='top' tabular>
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