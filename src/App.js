// import React, { useState } from 'react';
// import Dashboard from './components/dashboard/Dashboard';
// import Header from './components/Header/Header';

// export default () => {
//     const [selected, setSelected] = useState(options[0]);
//     return (
//         <div>
//             <Header>
//                 <div>
//                     <Route path="/dashboard">
//                         <Dashboard/>
//                     </Route>
//                 </div>
//             </Header>
//             {/* <Route path="/dropdown">
//                 <Dropdown 
//                     label="Select a color"
//                     options={options}
//                     selected={selected}
//                     onSelectedChange={setSelected}
//                 />
//             </Route> */}
//         </div>
//     );
// };
//React
import React from "react";
import { connect } from "react-redux";
import { Switch, Route, Redirect } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Dashboard from "./components/dashboard/Dashboard"

/* eslint-disable */
import ErrorPage from "./components/error/ErrorPage";
/* eslint-enable */

//Components, styles & assets
import "./styles/theme.scss";
// import LayoutComponent from "../components/Layout";
// import DocumentationLayoutComponent from "../documentation/DocumentationLayout";
// import Login from "../pages/login";
// import Register from "../pages/register";
// import { logoutUser, receiveToken } from "../actions/user";
import { encryptToken } from "./functions/functions";

// const PrivateRoute = ({
//   //ensure your loged in and doesnt alow you to access logged in exclusive routes if your not logged in
//   dispatch,
//   component,
//   isAuthenticated,
//   tokenData,
//   rToken,
//   ...rest
// }) => {
//   let res = Login.isAuthenticated(
//     localStorage.getItem("HWuCsirI$sD4"),
//     dispatch,
//     rToken,
//     tokenData
//   );

//   if (typeof res === "object") {
//     res.then(newTokenData => {
//       if (typeof newTokenData === "object") {
//         dispatch(
//           receiveToken(
//             newTokenData.data.access_token,
//             newTokenData.data.refresh_token
//           )
//         );
//         res = true;
//       }
//     });
//   }

//   if (typeof res === "object") {
//     return <div>Loading...</div>;
//   } else if (!res) {
//     dispatch(logoutUser());
//     return <Redirect to="/login" />;
//   } else {
//     return (
//       // eslint-disable-line
//       <Route
//         {...rest}
//         render={props => React.createElement(component, props)}
//       />
//     );
//   }
// };

const CloseButton = ({ closeToast }) => (
  <i onClick={closeToast} className="la la-close notifications-close" />
);

class App extends React.PureComponent {
  componentDidMount() {
    //run every time after the component mounts(render)
    window.addEventListener("beforeunload", e => {
      e.preventDefault();
      if (this.props.rToken) {
        localStorage.setItem(
          "(cEAEjW&RjYKWe4:",
          encryptToken(this.props.rToken)
        );
      }
    });
  }
  render() {
    return (
      <div>
        <ToastContainer
          autoClose={5000}
          hideProgressBar
          closeButton={<CloseButton />}
        />
        <BrowserRouter>
            <Route path="/" component={Dashboard} />
            {/* <Route path="/register" exact component={Register} />
            <Route path="/login" exact component={Login} /> */}
            <Route path="/error" component={ErrorPage} />
            {/* <PrivateRoute
              path="/"
              dispatch={this.props.dispatch}
              component={LayoutComponent}
              rToken={this.props.rToken}
              tokenData={this.props.tokenData}
              isAuthenticated={this.props.isAuthenticated}
            /> */}
        </BrowserRouter>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  rToken: state.auth.rToken,
  tokenData: state.auth.tokenData
});

export default connect(mapStateToProps)(App);