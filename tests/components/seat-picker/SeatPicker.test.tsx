import React from "react";
import { render } from "@testing-library/react";
import SeatPicker from "../../../src/components/seat-picker/SeatPicker";
import { BrowserRouter as Router } from "react-router-dom";
import { act } from "react-dom/test-utils";
import ReactDOM from 'react-dom';


describe("<SeatPicker />", () => {

    let history, container, emailInput, passwordInput, loggedin;

    beforeEach(async () => {

        act(() => {
            container = render(
                <Router>
                    <SeatPicker seats={{"sitze": []}} setCosts={20} setButton={""}/>
                </Router>
            );
        });


    });

    afterEach(() => {
        history = null;
        container = null;
        emailInput = null;
        passwordInput = null;
    });

    test('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(
        <Router>
            <SeatPicker seats={{"sitze": []}} setCosts={20} setButton={""}/>
        </Router>, div);
    });
});