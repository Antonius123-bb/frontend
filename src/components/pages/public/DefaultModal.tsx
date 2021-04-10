import * as React from "react";
import {Button, Message, Icon } from "semantic-ui-react";
import { SemanticICONS } from "semantic-ui-react/dist/commonjs/generic";

//Default Modal

interface defaultModalProps {
    handleUserManagement: any,
    description: string, 
    iconName: SemanticICONS, 
    success: boolean, 
    info: boolean
}

class DefaultModal extends React.Component<defaultModalProps, {}> {
    constructor(props: any) {
        super(props);
    }

    handleButtonOnClick = () => {
        try {
            history.pushState('', '', '/');
            this.props.handleUserManagement('login');
        } catch (e) {
            console.log("Error ", e)
        }
    }

    render() {
        const { description, iconName, success, info } = this.props;

        return (
            <div style={{'textAlign': 'center', 'marginTop': '10px', 'marginLeft': '10px', 'marginRight': '10px'}}>
                <Message icon success={success} info={info}>
                    <Icon name={iconName} />
                    {description}
                </Message>
                <Button onClick={() => this.handleButtonOnClick()}>
                    Einloggen
                </Button>
            </div>
        )
    }
}

export default DefaultModal;