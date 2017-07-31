import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Route, Redirect, Link } from 'react-router-dom';
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import NavBar from './nav/NavBar';

import { history } from '..';
import { ConnectedRouter } from 'react-router-redux';

// Components
import LandingPage from './LandingPage';
import Auth from './auth/';
// import TodoList from './todos';
import Account from './account';
import Flash from './flash';
import List from './List';

import { flashActions } from './flash';
import { authActions } from './auth';
import { accountActions } from './account';
import { todosActions } from './todos';

class Main extends Component {
  renderFlashMessage = () => {
    // check if there is a message to show
    if (this.props.flashState.showFlash) {
      //show message
      return (
        <Flash
          offClick={() => this.props.hideFlash()}
          show={this.props.flashState.showFlash}
          message={this.props.flashState.message}
          style={this.props.flashState.status}
        />
      );
    }
  };

  render() {
    return (
      <ConnectedRouter history={history}>
        {/*<NavBar authState={this.props.authState} />*/}
        <div>
          <Navbar fluid collapseOnSelect>
            <Navbar.Header>
              <Navbar.Brand>
                <Link to="/">
                  <div className="fancy small">HoneyDew</div>
                </Link>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
              <Nav pullRight>
                <LinkContainer exact to="/">
                  <NavItem>Home</NavItem>
                </LinkContainer>
                <LinkContainer to="/TodoList">
                  <NavItem>TodoList</NavItem>
                </LinkContainer>
                {this.props.authState.isLoggedIn
                  ? // Make logout logout immediately when logged in
                    <NavItem onClick={() => this.props.logoutThunk()}>
                      Logout
                    </NavItem>
                  : // or link to login page if logged out
                    <LinkContainer to="/Auth">
                      <NavItem>Login</NavItem>
                    </LinkContainer>}
                <NavDropdown
                  title={
                    // need to review this and change to check if image url exists
                    // needs to verify user state and image has been set
                    this.props.authState && this.props.accountState.image
                      ? //'account img'
                        <img
                          alt="fbpic"
                          className="img-circle noouter tiny"
                          src={this.props.accountState.picture}
                        />
                      : 'Account'
                  }
                  id="basic-nav-dropdown"
                >
                  <LinkContainer to="/account">
                    <MenuItem>Account</MenuItem>
                  </LinkContainer>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <div className="container-fluid">
            {this.renderFlashMessage()}
            <Route exact path="/" component={LandingPage} />
            <Route
              exact
              path="/TodoList"
              render={() =>
                !this.props.authState.isLoggedIn
                  ? <Redirect to="/Auth" />
                  : <List />}
            />
            <Route path="/Auth" component={Auth} />
            <Route path="/Account" render={() => <Account {...this.props} />} />
          </div>
        </div>
      </ConnectedRouter>
    );
  }
}

function mapStateToProps(state) {
  return { ...state };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      ...flashActions,
      ...authActions,
      ...accountActions,
      ...todosActions
    },
    dispatch
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(Main);
