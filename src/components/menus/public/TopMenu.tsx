import * as React from "react";
import { Menu, Segment, Icon, Modal, Dropdown, Header } from "semantic-ui-react";
import { topmenuItems } from "./TopMenuData";
import { Link } from "react-router-dom";
import Cart from "../../container/Cart";
import Login from "../../pages/public/Login";
import Signup from "../../pages/public/Signup";
import DefaultModal from "../../pages/public/DefaultModal";
import { USER_COOKIE_INFO, CART_COOKIE, USER_COOKIE_AUTH_CODE } from "../../../constants";
import ProfileRoot from "../../pages/private/Profile/ProfileRoot";
import userService from "../../../services/userService";

/*
* The Top Menu that occures on every page
* Gets data/pages from TopMenuData.ts
*/

interface topMenuState {
    activeTopMenuItem: string,
    activeProfileMenuItem: string,
    showCart: boolean,
    count: number,
    openModal: boolean,
    refreshCart: number,
    activePage: string,
    activated: boolean,
    dropdownOpen: boolean,
    openProfileModal: boolean,
    userIsAdmin: boolean
}

class TopMenu extends React.Component<{refreshCart: number, history: any}, topMenuState> {
    
    private mounted: boolean = false;

    constructor(props: any) {
        super(props);

        this.state = {
            activeTopMenuItem: 'Home',
            activeProfileMenuItem: 'orders',
            showCart: false,
            count: 0,
            openModal: false,
            refreshCart: 0,
            activePage: 'login',
            activated: false,
            dropdownOpen: false,
            openProfileModal: false,
            userIsAdmin: false
        };
    }

    componentDidMount(): void {
        this.mounted = true;
        
        if(this.mounted) {
            this.readFromURL();
            this.getCount();
            this.getAdminInfo();
        }
    }

    componentWillUnmount(): void {
        this.mounted = false;
    }

    //counter to manipulate the states and refresh the cart
    componentDidUpdate(prevProps: any) {
        if(prevProps.refreshCart != this.props.refreshCart && this.mounted) {
            this.setState({
                refreshCart: this.props.refreshCart
            })

            //calculate new sum of presentations that are in the card
            this.getCount();
        }
    }

    //function to set the state of the active oage to underline it
    handleTopMenuItemClick = (e: any, { name }: any) => {
        if(this.mounted) { this.setState({ activeTopMenuItem: name }) }
    }

    //read the url param after "/" to underline the correct top menu item
    readFromURL = () => {
        const url = window.location.href;

        if (url.includes('activated')){
            if(this.mounted) { this.setState({ activated: true }) }
        }

        if (url.includes('movie')){
            if(this.mounted) {  this.setState({ activeTopMenuItem: 'Filme' }) }
        } else if (url.includes('login')){
            if(this.mounted) { this.setState({ activeTopMenuItem: 'Login' }) }
        } else if (url.includes('presentations')){
            if(this.mounted) { this.setState({ activeTopMenuItem: 'Vorstellungen' }) }
        } else if (url.includes('presentation')){
            if(this.mounted) { this.setState({ activeTopMenuItem: null }) }
        } else if (url.includes('checkout')){
            if(this.mounted) { this.setState({ activeTopMenuItem: null }) }
        } else if (url.includes('thankyou')){
            if(this.mounted) { this.setState({ activeTopMenuItem: null }) }
        }
    }

    //show/close cart modal on click on the icon
    handleCartClick = () => {
        if(this.mounted) {  
            this.setState(prevState => ({
                showCart: !prevState.showCart
            }));
        }
    }

    //get the sum of the presentations that are in the card
    getCount = () => {
        var products = localStorage.getItem(CART_COOKIE);
        var productList = JSON.parse(products);

        if(productList != null) {

            if(this.mounted){
                this.setState({
                    count: productList.length
                })
            }
        }
    }

    //function that is passed as props to chil components, child components are able to change the modal to another page
    handleUserManagement = (pageName) => {
        if (this.mounted){
            this.setState({activePage: pageName, activated: false, openModal: true})
        }        
    };

    //give function to child to handle an modal close/open
    handleOpenModalState = (boolean) => {
        if (this.mounted){
            this.setState({openModal: boolean})
        }
    }

    //handle logout and delete localstorage object
    handleLogout() {
        try {
            localStorage.removeItem(USER_COOKIE_INFO);
            localStorage.removeItem(USER_COOKIE_AUTH_CODE);
            localStorage.removeItem(CART_COOKIE);
            this.props.history.push('/')
        } catch {

        }
    }

    //close the profile modal
    closeProfileModal = async() => {
        if(this.mounted) {
            this.setState({
                openProfileModal: false
            })
        }
    }

    //close the cart modal
    closeCartModal = () => {
        this.setState({
            showCart: false
        });
    }

    getAdminInfo = async () => {
        try {
            if(this.mounted){
                const response = await userService.getUserById(JSON.parse(localStorage.getItem(USER_COOKIE_INFO)).id)
                if (response) {
                    this.setState({
                        userIsAdmin: response.data.data.admin
                    })
                }
            }
        } catch {

        }
    }

    render() {
        const { activeTopMenuItem, activePage, activated } = this.state

        return (
            <React.Fragment>
                <Segment style={{'background': '#5D5C61', 'borderRadius': 0, 'marginBottom': '-20px'}}>
                    <Header as="h2" style={{'textAlign': 'center', 'color': 'white', 'fontSize': '40px', 'fontFamily': 'Lato, sans-serif'}}>
                    Corona Kino
                    </Header>
                </Segment>
                <Segment style={{'background': '#5D5C61', 'borderRadius': 0, 'borderTop': '0px'}}>
                    <Menu pointing secondary size="huge" widths="8" style={{'borderBottom': '0px'}}>

                    {/*render the pages that are in TopMenuData.ts*/}
                    {topmenuItems.map((item, index) => {
                        return (
                            <Menu.Item style={{'color': 'white'}}
                            as={Link}
                            to={item.path}
                            key={index}
                            name={item.name}
                            active={activeTopMenuItem === item.name}
                            onClick={this.handleTopMenuItemClick}
                            />
                        )
                    })}

                    {/*Cart icon and counter*/}
                    <Icon style={{"marginTop": "10px", "marginLeft": "250px", "color": "#F8EEE7", "cursor": "pointer"}} name={"cart"} size="large" onClick={() => this.handleCartClick()}/>
                    
                    {this.state.count > 0 &&<div style={{"color": "#F8EEE7"}}>{this.state.count}</div>}

                    {/*user icon*/}
                    {/* in case: user logged in */}
                    {localStorage.getItem(USER_COOKIE_INFO) && localStorage.getItem(USER_COOKIE_AUTH_CODE) &&
                        <React.Fragment>
                            <Dropdown text={JSON.parse(localStorage.getItem(USER_COOKIE_INFO)).name + " " + JSON.parse(localStorage.getItem(USER_COOKIE_INFO)).lastName} style={{"marginTop": "13px", "color": "white", "marginLeft": "50px"}}>
                                <Dropdown.Menu>
                                    <Dropdown.Item icon='user circle' text='Mein Profil' onClick={() => this.setState({openProfileModal: true})} />
                                    <Dropdown.Divider />
                                    {
                                    this.state.userIsAdmin &&
                                    <React.Fragment>
                                        <Dropdown.Item icon='adn' text='Admin Bereich' onClick={() => this.props.history.push('/admin')} />
                                        <Dropdown.Divider />
                                    </React.Fragment>
                                    }
                                    <Dropdown.Item icon='sign-out' text='Logout' onClick={() => this.handleLogout()}/>
                                </Dropdown.Menu>
                            </Dropdown>
                        </React.Fragment>
                    }
                    
                    {/* in case: user not logged in */}
                    {!localStorage.getItem(USER_COOKIE_INFO) &&
                        <Icon style={{"marginTop": "10px", "marginLeft": "50px", "color": "#F8EEE7", "cursor": "pointer"}} name='user' size="large" onClick={() => this.setState({openModal: true})}/>
                    }                   

                    </Menu>

                    <Modal style={{'minHeight': '300px'}} closeIcon open={this.state.showCart} onClose={() => this.setState({showCart: false})}>
                        <Cart closeModal={this.closeCartModal} getCount={this.getCount} refreshCart={this.state.refreshCart} />
                    </Modal>

                </Segment>

                {/*modal which contains the user management pages*/}
                <Modal
                    style={{ 'minHeight': '700px' }} 
                    open={this.state.openModal || activated}
                    onClose={() => this.setState({openModal: false, activated: false, activePage: 'login'}, () => history.pushState('', '', '/'))}
                    closeIcon
                >
                    {activePage === 'login' && !activated && 
                        <Login handleUserManagement={this.handleUserManagement} handleOpenModalState={this.handleOpenModalState}/>
                    }
                    {activePage === 'signup' && !activated &&  
                        <Signup handleUserManagement={this.handleUserManagement}/>
                    }
                </Modal>

                <ProfileRoot openProfileModal={this.state.openProfileModal} closeProfileModal={this.closeProfileModal} history={this.props.history} />

            </React.Fragment>
        )
    }
}

export default TopMenu;