import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Login from "../../../../src/components/pages/public/Login";
import { BrowserRouter as Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import userService from "../../../../src/services/userService";
import { waitFor } from "@testing-library/dom";
import { act } from "react-dom/test-utils";
import ReactDOM from 'react-dom';

const loginMock = jest.spyOn(userService, "login");

describe("<Login />", () => {

    let history, container, emailInput, passwordInput, loggedin;

    beforeEach(async () => {

        act(() => {
            container = render(
                <Router>
                    <Login handleUserManagement={""} handleOpenModalState={""}/>
                </Router>
            );
        });
        emailInput = container.getByTestId("email").children[0];
        passwordInput = container.getByTestId("password").children[0];
        loggedin = true;

        await waitFor(() => {
            act(() => {
                fireEvent.change(emailInput, {
                    target: {
                        value: "TestUser"
                    }
                });
                fireEvent.change(passwordInput, {
                    target: {
                        value: "TestPassword123"
                    }
                });
            });
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
            <Login handleUserManagement={""} handleOpenModalState={""}/>
        </Router>, div);
    });

    test("successfully logged in", async () => {
        loginMock.mockImplementation(() => {
            return Promise.resolve({
                name: "Testuser",
                Auth: "123456789"
            })
        });

        const loginForm = container.getByTestId("login-form");
        await waitFor(() => {
            fireEvent.submit(loginForm);
        });

        expect(loggedin).toEqual(true);
    });

    test("error logging in", async () => {
        loginMock.mockImplementation(() => {
            return Promise.resolve({
                error: "error"
            })
        });

        const loginForm = container.getByTestId("login-form");
        await waitFor(() => {
            fireEvent.submit(loginForm);
        });

        expect("error").toEqual("error");
    });
});