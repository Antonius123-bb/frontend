import React from "react";
import { render } from "@testing-library/react";
import ContactData from "../../../../../src/components/pages/private/Profile/ContactData";
import { BrowserRouter as Router } from "react-router-dom";
import { act } from "react-dom/test-utils";
import ReactDOM from 'react-dom';


describe("<ContactData />", () => {

    let history, container, emailInput, passwordInput, loggedin;

    beforeEach(async () => {

        act(() => {
            container = render(
                <Router>
                    <ContactData closeContactDataModal={""}/>
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
            <ContactData closeContactDataModal={""}/>
        </Router>, div);
    });
});