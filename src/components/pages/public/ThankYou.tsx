import * as React from "react";
import Grid from "semantic-ui-react/dist/commonjs/collections/Grid";
import TopMenu from "../../menus/public/TopMenu";
import { Header, Button, Icon, GridColumn } from "semantic-ui-react";

/*
* Just a simple page about our imprint and legal information
*/

class ThankYou extends React.Component<{history: any}, {}> {
    constructor(props: any) {
        super(props);

        this.state = {
        };

    }

    componentDidMount(): void {
        window.scrollTo(0, 0);
    }

    render() {

        return (
            <React.Fragment>
                <TopMenu refreshCart={0} history={this.props.history}/>
                <Grid columns={3}>
                    <Grid.Row centered>
                        <Header as="h2">Vielen Dank für Ihre Bestellung.
                        Checken Sie ihr Email Postfach!</Header>
                    </Grid.Row>
                    <Grid.Row centered>
                        <Button style={{'height': '500px', 'width': '500px', 'fontSize': '28px'}} onClick={() => this.props.history.push("/")}>
                        <Icon style={{'marginBottom': '50px'}} name="thumbs up" size="huge"/> <br/>
                            Zur Homepage
                        </Button>
                    </Grid.Row>
                </Grid>
            </React.Fragment>
        )
    }
}

export default ThankYou;