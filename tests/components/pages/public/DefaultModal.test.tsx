import React from "react";
import { render, fireEvent } from "@testing-library/react";
import DefaultModal from "../../../../src/components/pages/public/DefaultModal";
import { BrowserRouter as Router } from "react-router-dom";
import userService from "../../../../src/services/userService";
import { act } from "react-dom/test-utils";
import ReactDOM from 'react-dom';


describe("<DefaultModal />", () => {

    let history, container;

    beforeEach(async () => {

        act(() => {
            container = render(
                <Router>
                    <DefaultModal handleUserManagement={''} description={''} iconName={'mail'} success={false} info={false}/>
                </Router>
            );
        });

    });

    afterEach(() => {
        history = null;
        container = null;
    });

    test('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(
        <Router>
            <DefaultModal handleUserManagement={''} description={''} iconName={'mail'} success={false} info={false}/>
        </Router>, div);
    });
});