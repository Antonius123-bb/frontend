import * as React from "react";
import {Icon, Grid, Menu, Segment, Modal, Header} from "semantic-ui-react";
import Settings from "./Settings";
import Orders from "./Orders";
import userService from '../../../../services/userService';
import { USER_COOKIE_INFO } from "../../../../constants";
import ContactData from "./ContactData";

//Profile Root

interface profileRootState {
    openProfileModal: boolean,
    activeProfileMenuItem: string,
    userdata: {}
}

class ProfileRoot extends React.Component<{ openProfileModal: boolean, closeProfileModal: any, history: any }, profileRootState> {

    private mounted: boolean = false;

    constructor(props: any) {
        super(props);

        this.state = {
            openProfileModal: this.props.openProfileModal,
            activeProfileMenuItem: 'orders', //default menu item
            userdata: {}
        }
    }

    async componentDidMount() {
        this.mounted = true;
        
        //get user name from cookie and set state
        const user = localStorage.getItem(USER_COOKIE_INFO);

        if(user) {
            const response = await userService.getUserById(JSON.parse(user).id);


            if(this.mounted) {
                this.setState({
                    userdata: response.data
                })
            }
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    //called every single time the state/props update
    async componentDidUpdate(prevProps) {
        
        //handle open profile modal state
        if(prevProps.openProfileModal != this.props.openProfileModal) {
            const user = localStorage.getItem(USER_COOKIE_INFO);
            if(user) {
                if(this.mounted) {
                    this.setState({
                        userdata: JSON.parse(user)
                    })
                }
            }

            if(this.mounted) {
                this.setState({
                    openProfileModal: this.props.openProfileModal
                })
            }
        }
    }

    //function passed as prop to child components, receive data from children
    handleProfileMenuItemClick = (e: any, { name }: any) => {
        this.setState({ activeProfileMenuItem: name })
    }

    render() {

        const activeProfileMenuItem = this.state.activeProfileMenuItem;

        return (
            <Modal
                open={this.state.openProfileModal}
                onClose={() => this.props.closeProfileModal()}
                style={{'width': '90%', 'height': '90%'}}
            >                    
                <Grid doubling padded style={{'marginTop': '25px'}}> 
                    <Grid.Row centered style={{'marginBottom': '-10px'}}>
                        <Segment secondary style={{'width': '98%'}}>
                            <Icon onClick={() => {this.setState({ activeProfileMenuItem: 'overview'}); this.props.closeProfileModal()}} name='cancel' size='big' style={{'top': 10, 'right': 5, 'position': 'absolute', 'color':'#94618E', 'cursor': 'pointer'}}/>                             
                            <Header as="h2" style={{'marginTop': '-5px'}}>
                                Profil
                            </Header>                            
                        </Segment>
                    </Grid.Row> 
                    <Grid.Row>
                        <Grid.Column width={2}>
                            <Menu fluid vertical tabular>
                                <Menu.Item
                                name='orders'
                                active={activeProfileMenuItem === 'orders'}
                                onClick={this.handleProfileMenuItemClick}>
                                    Bestellungen
                                </Menu.Item>
                                <Menu.Item
                                name='contactData'
                                active={activeProfileMenuItem === 'contactData'}
                                onClick={this.handleProfileMenuItemClick}>
                                    Kontaktdaten 
                                </Menu.Item>
                                <Menu.Item
                                name='settings'
                                active={activeProfileMenuItem === 'settings'}
                                onClick={this.handleProfileMenuItemClick}>
                                    Einstellungen
                                </Menu.Item>
                            </Menu>                                
                        </Grid.Column>
                        <Grid.Column stretched width={14}>
                            <Segment>                     
                            {/* opens the different pages, depending on activeProfileMenuItem state */}
                            {activeProfileMenuItem === 'orders' &&
                                <Orders/>
                            }
                            {activeProfileMenuItem === 'settings' &&
                                <Settings userdata={this.state.userdata} history={this.props.history} closeModal={this.props.closeProfileModal}/>
                            }
                            {activeProfileMenuItem === 'contactData' &&
                                <ContactData closeContactDataModal={null} />
                            }
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal>
        )
    }
}

export default ProfileRoot;