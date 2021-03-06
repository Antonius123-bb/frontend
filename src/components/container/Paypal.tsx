import React, { useRef, useEffect } from 'react';
import presentationsService from '../../services/presentationsService';
import { CART_COOKIE } from '../../constants';

const Paypal = (props) => {

    const paypal = useRef()

    const buy = async (paypalTransactionId) => {
        const rechnung = {
            titel: props.user.adressen[props.selectedAdress].anrede,
            name: props.user.name,
            strasse: props.user.adressen[props.selectedAdress].strasse,
            plz: props.user.adressen[props.selectedAdress].plz,
            stadt: props.user.adressen[props.selectedAdress].stadt
        };

        const response = presentationsService.placeOrderWithPaypal(parseInt(props.presId), props.user.email, props.selectedSeats, 1, rechnung, paypalTransactionId);

        props.history.push('/thankyou');
        localStorage.removeItem(CART_COOKIE);
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