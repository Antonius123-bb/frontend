import * as React from "react";
import { Icon, Popup } from 'semantic-ui-react';
import { colors, icons } from "../../constants";

/*
* Our Seat Picker to pick the wanted seats
*/

//ganz wichtig checke welche sitze schon gebucht sind und unterscheide zwischen selcted und gebucht

class SeatPicker extends React.Component<{seats: any, setCosts: any, setButton: any}, {seats: any, classes: any, cost: number, costList: any, selectedSeats: Array<number>}> {
    
    private mounted: boolean = false;
    
    constructor(props: any) {
        super(props);

        this.state = {
            seats: this.props.seats,
            classes: this.props.seats.categories,
            cost: 0,
            costList: [],
            selectedSeats: []
        };

    }

    componentDidMount(): void {
        window.scrollTo(0, 0);

        this.mounted = true;
    }

    componenWillUnmount(): void {
        this.mounted = false;
    }

    //get all available seats that the room has on component did update
    componentDidUpdate(prevProps) {
        if(prevProps != this.props && this.mounted) {
            this.setState({
                seats: this.props.seats
            })
        }
    }

    //methode to book a seat
    bookSeat = (categorie, id) => {

        //get all seats
        let seats = this.state.seats;

        //find the correct seat
        const i = seats.seats.findIndex(x => x.id === id);

        //get costs and the cost per seat list
        let cost = this.state.cost;
        let costList = this.state.costList;

        //get all selected seats
        let selectedSeats = this.state.selectedSeats;

        //get the variable cost of the selected seat
        const varCost = this.state.seats.categories.find(x => x.name === categorie);

        //if seat is selected by user
        if(seats.seats[i].booked) {
            //unselected the seat
            seats.seats[i].booked = false;
            seats.seats[i].selected = false;

            //subtract the costs
            cost = cost - (this.state.seats.basicprice + varCost.upsell);
            const costIndex = costList.findIndex(x => x.id === seats.seats[i].id);
            costList.splice(costIndex, 1);

            //delete seat from the selected seats array
            const seatIndex = selectedSeats.findIndex(x => x === id);
            if(seatIndex > -1) {
                selectedSeats.splice(seatIndex, 1);
            }

        } else {
            //select the seat
            seats.seats[i].booked = true;
            seats.seats[i].selected = true;

            //add the costs
            cost = cost + (this.state.seats.basicprice + varCost.upsell);
            console.log("S,C:", this.state.seats)

            //add seat to the selected seats array
            selectedSeats.push(id);

            //add seat + some information to the detailed costlist
            let position = {
                id: seats.seats[i].id,
                price: this.state.seats.basicprice + varCost.upsell,
                category: categorie
            }

            costList.push(position);
        }

        //set costs in parent component to return them on the right site (on page)
        this.props.setCosts(cost, costList);
        
        //set submit button to disabled if no seats are selected
        if(selectedSeats.length > 0) {
            this.props.setButton(true, selectedSeats);
        } else {
            this.props.setButton(false, selectedSeats);
        }

        //set updated states
        if(this.mounted) {
            this.setState({
                cost: cost,
                costList: costList,
                seats: seats,
                selectedSeats: selectedSeats
            })
        }
    }

    render() {

        console.log("SS", this.state.seats.seats)

        return (

            <div style={{'height': this.state.seats.height, 'width': this.state.seats.width * 2, 'marginTop': '25px'}}>

                {
                    this.state.seats.seats.map((seat, index) => {

                        const cat = this.state.classes.find(x => x.name === seat.category);
                        
                        /*show seats that are selected by user with a green check icon*/
                        if(seat.selected === true) {
                            return (
                                <Popup key={index} content="belegt" trigger={
                                    //------------------------------call book function on click on seat
                                    <div key={index} onClick={() => this.bookSeat(cat.name, seat.id)}
                                    style={{
                                        'position': 'absolute',
                                        'left': seat.x * 2,
                                        'top': seat.y * 2,
                                        'background': 'green',
                                        'height': '35px',
                                        'width': cat.name === 'Loveseat' ? '85px' : '35px',
                                        'textAlign': 'center',
                                        'paddingTop': '5px',
                                        'borderRadius': '3px',
                                        'cursor': 'pointer'
                                    }}>
                                        <Icon name="check" />
                                    </div>
                                } />
                            )
                        } else if(seat.booked === true) {
                            /*show seats that are not available any more in grey with an "x" icon so they are not selectable*/
                            return (
                                <Popup key={index} content="belegt" trigger={
                                    <div key={index}
                                    style={{
                                        'position': 'absolute',
                                        'left': seat.x * 2,
                                        'top': seat.y * 2,
                                        'background': 'grey',
                                        'height': '35px',
                                        'width': cat.name === 'Loveseat' ? '85px' : '35px',
                                        'textAlign': 'center',
                                        'paddingTop': '5px',
                                        'borderRadius': '3px'
                                    }}>
                                        <Icon name="cancel" />
                                    </div>
                                } />
                            )
                        } else {
                            /*show seats that are not not selected and not booked so a user can select them*/
                            return (
                                <Popup key={index} content={cat.name} trigger={
                                    //------------------------------call book function on click on seat
                                    <div key={index} onClick={() => this.bookSeat(cat.name, seat.id)}
                                    style={{
                                        'position': 'absolute',
                                        'left': seat.x * 2,
                                        'top': seat.y * 2,
                                        'background': colors[cat.name],
                                        'height': '35px',
                                        'width': cat.name === 'Loveseat' ? '85px' : '35px',
                                        'textAlign': 'center',
                                        'paddingTop': '7px',
                                        'borderRadius': '3px',
                                        'cursor': 'pointer',
                                        'paddingLeft': '3px'
                                    }}>
                                        <Icon name={icons[cat.name]} style={{'color': 'white'}} />
                                    </div>
                                } />
                            )
                        }
                    })
                }
                
            </div>
        )
    }
}

export default SeatPicker;