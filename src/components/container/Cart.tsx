import * as React from 'react';
import { Icon, Menu, Label, Message, Grid, Header, Segment } from 'semantic-ui-react';
import { withRouter } from "react-router";
import { CART_COOKIE } from '../../constants';

//TODO delete card item after buy

interface cartState {
    products: Array<{}>,
    productList: Array<{}>,
    counts: string
}

interface cartProps {
    refreshCart: any,
    history: any,
    getCount: any,
    handleCartToCheckout: any,
    closeModal: any
}

class Cart extends React.Component<cartProps, cartState> {
    
    private mounted: boolean = false;

    constructor(props: any) {
        super(props);

        this.state = {
            products: [],
            productList: [],
            counts: ""
        };
    }

    componentDidMount(): void {
        this.mounted = true;
        
        if(this.mounted) {
            this.getProducts();
        }
    }

    componentDidUpdate(prevProps: any) {
        if(prevProps.refreshCart != this.props.refreshCart) {
            this.getProducts();
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    getProducts() {
        var products = localStorage.getItem(CART_COOKIE);
        var productList = JSON.parse(products);

        if(products && this.mounted) {
            this.setState({
                productList: productList,
            })
        }
    }

    removeProduct(id: any) {
        var products = localStorage.getItem(CART_COOKIE);
        var productList = JSON.parse(products);

        productList.splice(id, 1);

        if(products && this.mounted) {
            this.setState({
                productList: productList,
            })
        }

        productList = JSON.stringify(productList);

        localStorage.setItem(CART_COOKIE, productList);

        this.props.getCount();
    }

    toCheckout = (index) => {

        var products = localStorage.getItem(CART_COOKIE);
        var productList = JSON.parse(products);

        var product = productList[index];

        try {
            this.props.history.push({
                pathname: '/checkout',
                state: { 
                    selectedSeats: product.selectedSeats,
                    cost: product.cost,
                    costList: product.costList,
                    movieName: product.movieName,
                    presentationId: product.presentationId,
                }
            });
            this.props.closeModal();
        } catch(e) {}

    }

    render() {

        return (
            <React.Fragment>
                <Segment secondary style={{'marginLeft': '5px', 'marginRight': '5px', 'marginTop': '5px', 'textAlign': 'center'}}>
                    <Header as="h2" style={{'marginTop': '-5px'}}>
                        Warenkorb
                    </Header>                            
                </Segment>

                {this.state.productList && 
                this.state.productList.map((item, index) => {
                    
                    return (
                    <Menu.Item style={{'height': '50px'}} name={item['movieName']} key={index}>
                        <a style={{'cursor': 'pointer'}} onClick={() => this.toCheckout(index)}>{item['movieName']}</a> ({item['selectedSeats'].length} {item['selectedSeats'].length > 1 ? "Tickets": "Ticket"})
                        <Label style={{'float': 'right'}} color='teal'>{item['cost']}€</Label>
                        <Icon style={{'cursor': 'pointer', 'float': 'left'}} color="red" name="cancel" onClick={() => this.removeProduct(index)}/>
                    </Menu.Item>
                    )
                })}
                {this.state.productList.length === 0 &&
                <Grid>
                    <Grid.Row columns={3} style={{'marginBottom': '10px'}}>
                        <Grid.Column width={1}></Grid.Column>
                        <Grid.Column width={14}>
                            <Message
                                header="Keine Tickets im Warenkorb."
                                content="Fügen Sie Tickets zu ihrem Warenkorb hinzu."
                            >
                            </Message>
                        </Grid.Column>
                        <Grid.Column width={1}></Grid.Column>
                    </Grid.Row>
                </Grid>
                }
            </React.Fragment>
        )
    }
}

export default withRouter(Cart);