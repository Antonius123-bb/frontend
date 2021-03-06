import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Signup from "../../../../src/components/pages/public/Signup";
import { BrowserRouter as Router } from "react-router-dom";
import { act } from "react-dom/test-utils";
import ReactDOM from 'react-dom';


describe("<PresentationOverview />", () => {

    let  container;

    beforeEach(async () => {

        act(() => {
            container = render(
                <Router>
                    <Signup handleUserManagement={''}/>
                </Router>
            );
        });

    });

    afterEach(() => {
        container = null;
    });

    test('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(
        <Router>
            <Signup handleUserManagement={''}/>
        </Router>, div);
    });
});