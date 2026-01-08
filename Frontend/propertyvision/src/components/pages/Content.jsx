import React from "react";
import { Element } from "react-scroll";
import Navbar from "./Navbar";

import Home from "../HomeDashboard/Home";
import Analytics from "../HomeDashboard/Analytics";
import ViewPropertys from "../HomeDashboard/ViewPropertys";

const Content = () => {
  return (
    <>
      <Navbar />

      {/* Offset for fixed navbar */}
      <div className="pt-24">
        <Element name="home">
          <Home />
        </Element>

        <Element name="analytics">
          <Analytics />
        </Element>

        <Element name="viewpropertys">
          <ViewPropertys />
        </Element>
      </div>
    </>
  );
};

export default Content;
