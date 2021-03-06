import React from "react";
import { render } from "@testing-library/react";
import Settings from "../../../../../src/components/pages/private/Profile/Settings";
import { BrowserRouter as Router } from "react-router-dom";
import { act } from "react-dom/test-utils";
import ReactDOM from 'react-dom';


describe("<Settings />", () => {

    let history, container, emailInput, passwordInput, loggedin;

    beforeEach(async () => {

        act(() => {
            container = render(
                <Router>
                    <Settings userdata={{"test": true}} history={""} closeModal={""}/>
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
            <Settings userdata={{"test": true}} history={""} closeModal={""}/>
        </Router>, div);
    });
});