import React from "react";
import { render, fireEvent } from "@testing-library/react";
import PresentationOverview from "../../../../src/components/pages/public/PresentationOverview";
import { BrowserRouter as Router } from "react-router-dom";
import { act } from "react-dom/test-utils";
import ReactDOM from 'react-dom';
import { createMemoryHistory } from "history";


describe("<PresentationOverview />", () => {

    let history, container;

    beforeEach(async () => {

        history = createMemoryHistory({initialEntries: ['/']});
        act(() => {
            container = render(
                <Router>
                    <PresentationOverview withoutTopBar={false} history={history}/>
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
            <PresentationOverview withoutTopBar={false} history={history}/>
        </Router>, div);
    });
});