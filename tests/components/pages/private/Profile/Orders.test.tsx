// import React from "react";
// import { render } from "@testing-library/react";
// import Orders from "../../../../../src/components/pages/private/Profile/Orders";
// import { BrowserRouter as Router } from "react-router-dom";
// import { act } from "react-dom/test-utils";
// import ReactDOM from 'react-dom';
// import { createMemoryHistory } from "history";


// describe("<Orders />", () => {

//     let history, container, emailInput, passwordInput, loggedin;

//     beforeEach(async () => {

//         history = createMemoryHistory({initialEntries: ['/']});
//         act(() => {
//             container = render(
//                 <Router>
//                     <Orders history={history} />
//                 </Router>
//             );
//         });


//     });

//     afterEach(() => {
//         history = null;
//         container = null;
//         emailInput = null;
//         passwordInput = null;
//     });

//     test('renders without crashing', () => {
//         const div = document.createElement('div');
//         ReactDOM.render(
//         <Router>
//             <Orders history={history} />
//         </Router>, div);
//     });
// });