import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Imprint from "../../../../src/components/pages/public/Imprint";
import { BrowserRouter as Router } from "react-router-dom";
import { act } from "react-dom/test-utils";
import ReactDOM from 'react-dom';
import { createMemoryHistory } from "history";


describe("<Imprint />", () => {

    let history, container;

    beforeEach(async () => {

        history = createMemoryHistory({initialEntries: ['/']});
        act(() => {
            container = render(
                <Router>
                    <Imprint history={history}/>
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
            <Imprint history={history}/>
        </Router>, div);
    });
});