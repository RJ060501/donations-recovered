import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import {
  Navbar,
  Nav,
  Dropdown,
  NavItem,
  NavLink,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledTooltip
} from "reactstrap";
import { NavbarTypes } from "../../reducers/layout";
import { logoutUser } from "../../actions/user";
import chroma from "chroma-js";
import {
  toggleSidebar,
  openSidebar,
  closeSidebar,
  changeActiveSidebarItem
} from "../../actions/navigation";

import s from "./Header.module.scss"; // eslint-disable-line css-modules/no-unused-class

class Header extends React.Component {
  static propTypes = {
    sidebarOpened: PropTypes.bool.isRequired,
    sidebarStatic: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string
    }).isRequired
  };

  constructor(props) {
    super(props);

    this.toggleMenu = this.toggleMenu.bind(this);
    this.switchSidebar = this.switchSidebar.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.doLogout = this.doLogout.bind(this);

    this.state = {
      menuOpen: false
    };
  }

  doLogout() {
    this.props.dispatch(logoutUser(this.props.tokenData || {}.token));
  }

  // collapse/uncolappse
  switchSidebar() {
    if (this.props.sidebarOpened) {
      this.props.dispatch(closeSidebar());
      this.props.dispatch(changeActiveSidebarItem(null));
    } else {
      const paths = this.props.location.pathname.split("/");
      paths.pop();
      this.props.dispatch(openSidebar());
      this.props.dispatch(changeActiveSidebarItem(paths.join("/")));
    }
  }

  // static/non-static
  toggleSidebar() {
    this.props.dispatch(toggleSidebar());
    if (this.props.sidebarStatic) {
      localStorage.setItem("staticSidebar", "false");
      this.props.dispatch(changeActiveSidebarItem(null));
    } else {
      localStorage.setItem("staticSidebar", "true");
      const paths = this.props.location.pathname.split("/");
      paths.pop();
      this.props.dispatch(changeActiveSidebarItem(paths.join("/")));
    }
  }

  toggleMenu() {
    this.setState({
      menuOpen: !this.state.menuOpen
    });
  }
  render() {
    const { navbarType, navbarColor } = this.props;

    return (
      <Navbar
        className={`${s.root} d-print-none ${
          navbarType === NavbarTypes.FLOATING ? s.navbarFloatingType : ""
        }`}
      >
        <Nav>
          <NavItem>
            <NavLink
              className="d-md-down-none ml-5"
              id="toggleSidebar"
              onClick={this.toggleSidebar}
            >
              <i
                className={`la la-bars ${
                  chroma(navbarColor).luminance() < 0.4 ? "text-white" : ""
                }`}
              />
            </NavLink>
            <UncontrolledTooltip placement="bottom" target="toggleSidebar">
              Turn on/off
              <br />
              sidebar
              <br />
              collapsing
            </UncontrolledTooltip>
            <NavLink className="fs-lg d-lg-none" onClick={this.switchSidebar}>
              <span
                style={{
                  backgroundColor:
                    navbarColor !== "#ffffff"
                      ? chroma(navbarColor).darken(1)
                      : "#495057"
                }}
                className={`rounded rounded-lg d-md-none d-sm-down-block`}
              >
                <i
                  className="la la-bars"
                  style={{
                    color:
                      navbarColor === "#ffffff"
                        ? "#ffffff"
                        : chroma(navbarColor).luminance() < 0.4
                        ? "#ffffff"
                        : ""
                  }}
                />
              </span>
              <i
                className={`la la-bars ml-3 d-sm-down-none ${
                  chroma(navbarColor).luminance() < 0.4 ? "text-white" : ""
                }`}
              />
            </NavLink>
          </NavItem>
        </Nav>

        <NavLink
          className={`${s.navbarBrand} d-md-none ${
            chroma(navbarColor).luminance() < 0.4 ? "text-white" : ""
          }`}
        >
          <i className="fa fa-circle text-gray mr-n-sm" />
          <i className="fa fa-circle text-warning" />
          &nbsp; WeAre8 &nbsp;
          <i className="fa fa-circle text-warning mr-n-sm" />
          <i className="fa fa-circle text-gray" />
        </NavLink>

        <Nav className="ml-auto">
          <Dropdown
            nav
            isOpen={this.state.menuOpen}
            toggle={this.toggleMenu}
            className="d-sm-down-none"
          >
            <DropdownToggle nav>
              <i
                className={`la la-cog ${
                  chroma(navbarColor).luminance() < 0.4 ? "text-white" : ""
                }`}
              />
            </DropdownToggle>
            <DropdownMenu right className="super-colors">
              <DropdownItem onClick={this.doLogout}>
                <i className="la la-sign-out" /> Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Nav>
      </Navbar>
    );
  }
}

function mapStateToProps(store) {
  return {
    sidebarOpened: store.navigation.sidebarOpened,
    sidebarStatic: store.navigation.sidebarStatic,
    navbarType: store.layout.navbarType,
    navbarColor: store.layout.navbarColor,
    tokenData: store.auth.tokenData,
    rToken: store.auth.rToken
  };
}

export default withRouter(connect(mapStateToProps)(Header));
