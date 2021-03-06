import * as React from "react";
import {Icon, Button, Header, Accordion, Modal} from "semantic-ui-react";
import { COOKIE_VALUE } from "../../constants";

/*
* Our cookie consent that occures on the very first page call from a client
*/

interface profileRootState {
    openCookieModal: boolean,
    activeIndex: number
}

class CookieConsent extends React.Component<{ openCookieModal: boolean }, profileRootState> {

    private mounted: boolean = false;

    constructor(props: any) {
        super(props);

        this.state = {
            openCookieModal: this.props.openCookieModal, //state to handle the status of the modal
            activeIndex: 0 //switch value to handle accordion clicks
        }
    }

    async componentDidMount() {
        this.mounted = true;

        const cookieVal = localStorage.getItem(COOKIE_VALUE);
        
        //check if this cookie is already set
        if(cookieVal != null) {
            if(this.mounted) {
                this.setState({
                    openCookieModal: false
                })
            }
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    //handle an accordion click and switch if needed
    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index
    
        this.setState({ activeIndex: newIndex })
    }

    //save the cookie of the selection after submit
    saveCookie = (cookieVal) => {
        localStorage.setItem(COOKIE_VALUE, cookieVal);

        if(this.mounted) {
            this.setState({
                openCookieModal: false
            })
        }
    }

    render() {

        const activeIndex = this.state.activeIndex;

        return (
            <Modal
                open={this.state.openCookieModal}
            >      
                <Header as="h2">Cookies</Header>

                <Accordion styled style={{'width': '100%'}}>
                    <Accordion.Title
                    active={activeIndex === 0}
                    index={0}
                    onClick={this.handleClick}
                    >
                    <Icon name='dropdown' />
                    Tracking Cookies
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 0}>
                    <p>
                        Wir möchten Ihren Besuch auf unserer Website angenehm gestalten – 
                        durch stetige Optimierung der Seite und individuelle Angebote. 
                        Dafür sammeln wir Informationen unserer Besucher, wobei Cookies 
                        (auch von Drittanbietern) eine wichtige Rolle spielen. 
                    </p>
                    
                    {/*save tracking cookie*/}
                    <Button onClick={() => this.saveCookie("tracking")} positive>Zustimmen</Button>
                    </Accordion.Content>

                    <Accordion.Title
                    active={activeIndex === 1}
                    index={1}
                    onClick={this.handleClick}
                    >
                    <Icon name='dropdown' />
                    Functional Cookies
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 1}>
                    <p>
                        Ihre Daten werden ausschließlich verschlüsselt übertragen. Technisch n
                        otwendige Cookies werden auch bei der Auswahl von ablehnen gesetzt. 
                        Ihre Einstellungen können Sie später am Seitenende unter "Cookie-Einstellungen" 
                        ändern. Mit Klick auf "Zustimmen" stimmen Sie allen Cookies und der Übermittlung Ihrer Daten in Drittländer zu. 
                    </p>

                    {/*save only functional cookies*/}
                    <Button onClick={() => this.saveCookie("functional")} primary>Zustimmen</Button>
                    </Accordion.Content>
                </Accordion>
            </Modal>
        )
    }
}

export default CookieConsent;




