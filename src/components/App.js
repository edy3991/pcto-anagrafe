import React, {Component} from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {connect} from "react-redux";
import {reloadStructure} from "../redux/actions/structureAction";
import {initLogin} from "../redux/actions/authAction";

import AnonymousPage from "./ui/AnonymousPage";
import AdminNav from "./ui/AdminNav";
import UserNav from "./ui/UserNav";
import SearchCompany from "./forms/SearchCompany";
import EditStructure from "./forms/EditStructure";
import CompanyDetails from "./company/CompanyDetails";
import ShowSaved from "./forms/ShowSaved";
import Footer from "./ui/Footer";

/**
 * The application wrapper.
 *
 * @author Riccardo Sartori
 */
class App extends Component {
  constructor(props) {
    super(props);

    this.props.initLogin();
    this.props.initStructure();
  }

  componentDidUpdate() {
    this.props.initStructure();
  }

  render() {
    const {initialized, privileges, token} = this.props;
    if(!initialized) return null;

    let links, nav;
    if(!token) {
      links = <AnonymousPage />
      nav = null;
    }
    else if("ADMIN" in privileges) {
      links = (
        <Switch>
          <Route path="/search" component={SearchCompany} />
          <Route path="/structure" component={EditStructure} />
          <Route path="/company/:id" component={CompanyDetails} />
          <Route path="/saved" component={ShowSaved} />
          {/*
          <Route path="/add" component={} />
          <Route path="/projects" component={} />
          */}
          <Route path="/" component={SearchCompany} />
        </Switch>
      );
      nav = <AdminNav />;
    }
    else {
      links = (
        <Switch>
          <Route path="/search" component={SearchCompany} />
          <Route path="/company/:id" component={CompanyDetails} />
          <Route path="/saved" component={ShowSaved} />
          {/*
          <Route path="/projects" component={} />
          */}
          <Route path="/" component={SearchCompany} />
        </Switch>
      );
      nav = <UserNav />;
    }

    return(
      <BrowserRouter>
        {nav}
        {links}
        <Footer />
      </BrowserRouter>
    );
  }
}

function mapStateToProps(state) {
  return {
    privileges: state.auth.privileges,
    token: state.auth.token,
    initialized: state.auth.initialized,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    initStructure: () => {
      dispatch(reloadStructure());
    },
    initLogin: () => {
      dispatch(initLogin());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);