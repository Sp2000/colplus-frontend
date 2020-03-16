import React from "react";

import Layout from "../../../components/LayoutNew";
import SyncTable from "./SyncTable";
import config from "../../../config";

const { MANAGEMENT_CLASSIFICATION } = config;

const _ = require("lodash");

class SectorSync extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Layout
        selectedKeys={["sectorSync"]}
        openKeys={["assembly"]}
        title={MANAGEMENT_CLASSIFICATION.title}
      >
        <SyncTable location={this.props.location} match={this.props.match}/>
      </Layout>
    );
  }
}

export default SectorSync;
