import React, { Component } from "react";
import ReactDOM from "react-dom";
import Footer from "./components/container/Footer";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Landingpage from './components/pages/public/Landingpage';
import MovieOverview from './components/pages/public/MovieOverview';
import MovieDetail from './components/pages/public/MovieDetail';
import PresentationDetail from './components/pages/public/PresentationDetail';
import PresentationOverview from './components/pages/public/PresentationOverview';
import Imprint from './components/pages/public/Imprint';
import Checkout from './components/pages/public/Checkout';
import Privacy from './components/pages/public/Privacy';
import AdminOverview from './components/pages/admin/AdminOverview'
import './axiosConfig';
import CookieConsent from './components/container/CookieConsent';
import ThankYou from "./components/pages/public/ThankYou";


class App extends Component {

  private mounted: boolean = false;
  
  render() {
    return (
      <React.Fragment>

        <CookieConsent openCookieModal={true} />
        
        <Router>
            <div>
                <Switch>
                    <Route path="/" exact component={Landingpage}/>
                    <Route path="/movies" component={MovieOverview}/>
                    <Route path="/movie" component={MovieDetail}/>
                    <Route path="/admin" component={AdminOverview}/>
                    <Route path="/presentation/:id" component={PresentationDetail}/>
                    <Route path="/presentations" component={PresentationOverview}/>
                    <Route path="/imprint" component={Imprint}/>
                    <Route path="/checkout" component={Checkout}/>
                    <Route path="/privacy" component={Privacy}/>
                    <Route path="/thankyou" component={ThankYou}/>
                    <Route component={Landingpage} />
                </Switch>
            </div>

            <Footer />
        </Router>

      </React.Fragment>
    );
  }
}

export default App;

const wrapper = document.getElementById("container");
wrapper ? ReactDOM.render(<App />, wrapper) : false;