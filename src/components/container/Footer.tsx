import * as React from "react";
import { Segment } from 'semantic-ui-react';
import { withRouter } from "react-router";

/*
* The footer that occures on every page
*/

class Footer extends React.Component<{history: any}, {}> {
    
    private mounted: boolean = false;

    constructor(props: any) {
        super(props);

        this.state = {
        };
    }

    componentDidMount(): void {
        this.mounted = true;
        
        if(this.mounted) {

        }
    }

    componentWillUnmount(): void {
        this.mounted = false;
    }

    render() {

        return (
            <Segment style={{'background': '#94618E', 'borderRadius': 0}}>
                <div style={{'textAlign': 'center', 'color': '#F4DECB'}}>DHBW Kino</div>
                <div style={{'textAlign': 'center'}}>
                    <p>
                        <a style={{'color': '#F4DECB', 'cursor': 'pointer', 'textDecoration': 'underline'}} onClick={() => this.props.history.push("/imprint")}>Impressum</a>
                        | 
                        <a style={{'color': '#F4DECB', 'cursor': 'pointer', 'textDecoration': 'underline'}} onClick={() => this.props.history.push("/privacy")}>Datenschutzerklärung</a>
                    </p>
                </div>
            </Segment>
        )
    }
}


export default withRouter(Footer);