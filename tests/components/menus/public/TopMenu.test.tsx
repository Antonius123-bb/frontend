import React from "react";
import { render } from "@testing-library/react";
import TopMenu from "../../../../src/components/menus/public/TopMenu";
import { BrowserRouter as Router } from "react-router-dom";
import { act } from "react-dom/test-utils";
import ReactDOM from 'react-dom';


describe("<TopMenu />", () => {

    let history, container, emailInput, passwordInput, loggedin;

    beforeEach(async () => {

        act(() => {
            container = render(
                <Router>
                    <TopMenu history={""} refreshCart={0}/>
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
            <TopMenu history={""} refreshCart={0}/>
        </Router>, div);
    });
});