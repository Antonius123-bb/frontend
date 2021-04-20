import React, { useRef, useEffect } from 'react';
import presentationsService from '../../services/presentationService';
import { CART_COOKIE } from '../../constants';

const Paypal = (props) => {

    const paypal = useRef()

    const buy = async (paypalTransactionId) => {

        const response = await presentationsService.bookSeats(props.selectedSeats, props.presentationId, props.userId, "paypal", props.selectedAdress);
        
        if(response.status === 200) {
            this.props.history.push("/thankyou");
            localStorage.removeItem(CART_COOKIE);

            if(this.state.error != "" && this.mounted) {
                this.setState({
                    error: ""
                })
            }
        } else {
            if(this.mounted) {
                this.setState({
                    error: response.data
                })
            }
        }
    }

    useEffect(() => {
        window['paypal'].Buttons({
            style: {
                layout:  'vertical',
                color:   'blue',
                shape:   'rect',
                label:   'paypal'
            },
            createOrder: (data, actions, err) => {
                return actions.order.create({
                    intent: "CAPTURE",
                    purchase_units: [
                        {
                            description: props.desc,
                            amount: {
                                currency_code: "EUR",
                                value: props.totalCost
                            }
                        }
                    ]
                })
            },
            onApprove: async (data, actions) => {
                const order = await actions.order.capture();

                buy(order.id);
            },
            onError: (err) => {
            }
        }).render(paypal.current)
    }, [])

    return (
        <div>
            <div ref={paypal}></div>
        </div>
    )
}

export default Paypal;