import * as React from "react";
import Grid from "semantic-ui-react/dist/commonjs/collections/Grid";
import TopMenu from "../../menus/public/TopMenu";

/*
* Just a simple page about our imprint and legal information
*/

class Imprint extends React.Component<{history: any}, {}> {
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
                    <Grid.Column width={1}></Grid.Column>
                    <Grid.Column width={14}>
                        <h2>Impressum</h2>
                        <p>Adrian Albrecht, Niklas Borg<br/>Holbeinstr. 13<br/>68163 Mannheim<br/>Deutschland</p>
                        <p>Telefon: +49 176 26326256<br/>E-Mail: info@dhbw-kino.de</p>
                    </Grid.Column>
                    <Grid.Column width={1}></Grid.Column>
                </Grid>
            </React.Fragment>
        )
    }
}

export default Imprint;