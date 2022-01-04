//React
import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { withRouter } from "react-router-dom";

//Components, styles, & assets
import s from "./Home.module.scss";

const Home = props => {
  return (
    <>
      <div>
        <div className={s.homeHeader}>
          <h1 className={s.welcome}>Welcome</h1>
          <span className={s.firstLast}>First Last</span>
        </div>
        <div className={s.homeBody}>
          <div className={s.boxesContainer}>
            <div
              className={s.communityTilesBox}
              onClick={e => {
                props.history.push("/community-tiles");
              }}
            >
              <FontAwesomeIcon className={s.heartIcon} icon="heart" />
              <h1 className={s.communityTiles}>Communuty Tiles</h1>
              <p className={s.communityTilesDescription}>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                eiusmod tempor insididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            <div
              className={s.userJourneysBox}
              onClick={e => {
                props.history.push("/user-journeys");
              }}
            >
              <FontAwesomeIcon className={s.sitemapIcon} icon="sitemap" />
              <h1 className={s.userJourneys}>User Journeys</h1>
              <p className={s.userJourneysDescription}>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                eiusmod tempor insididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default withRouter(Home);
