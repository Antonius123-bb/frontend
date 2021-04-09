import moment from 'moment';
import * as React from 'react';
import { Button, Divider, Popup, Segment } from 'semantic-ui-react';

interface cartProps {
    presentation: any
    threeD: any,
    history: any
}

class PresentationDateComponent extends React.Component<cartProps> {
    
    private mounted: boolean = false;

    constructor(props: any) {
        super(props);

        this.state = {
        };
    }

    componentDidMount(): void {
        this.mounted = true;
        
    }

    componentWillUnmount(): void {
        this.mounted = false;
    }

    pushToPresentationDetailPage = (presentation) => {
        try {
            this.props.history.push({
                pathname: '/presentation/'+presentation['_id']
            })

        }
        catch {

        }
    }

    render() {
        const threeD = this.props.threeD;
        const presentation = this.props.presentation;
        const presentationStart = presentation['presentationStart'];

        return (
            <React.Fragment>
               
               {threeD ?
                    <Popup content='3D Vorstellung' position='top center' trigger={
                        <Segment color='red' stacked compact style={{'width': '120px', 'cursor': 'pointer', 'textAlign': 'center'}} floated='left' onClick={() => this.pushToPresentationDetailPage(presentation)}>
                        {presentationStart && moment(presentationStart).locale('de').format("dddd")} <br/>
                        <Divider style={{'marginLeft': '-10%', 'marginRight': '-10%'}} fitted/>
                        {presentationStart && moment(presentationStart).format("DD.MM.YYYY")} <br/>
                        {presentationStart && moment(presentationStart).locale('de').format("HH:mm")} Uhr
                        </Segment>
                    } /> 
                    :
                    <Segment color='blue' stacked compact style={{'width': '120px', 'cursor': 'pointer', 'textAlign': 'center'}} floated='left' onClick={() => this.pushToPresentationDetailPage(presentation)}>
                        {presentationStart && moment(presentationStart).locale('de').format("dddd")} <br/>
                        <Divider style={{'marginLeft': '-10%', 'marginRight': '-10%'}} fitted/>
                        {presentationStart && moment(presentationStart).format("DD.MM.YYYY")} <br/>
                        {presentationStart && moment(presentationStart).locale('de').format("HH:mm")} Uhr
                    </Segment>
                }
            </React.Fragment>
        )
    }
}

export default PresentationDateComponent;