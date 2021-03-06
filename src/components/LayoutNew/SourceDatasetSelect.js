import React from "react";
import withContext from "../../components/hoc/withContext";
import { withRouter } from "react-router-dom";
import config from "../../config";
import _ from "lodash";
import { SearchOutlined } from "@ant-design/icons";
import { Modal, Select } from "antd";
import history from "../../history";
// import DatasetAutocomplete from "../catalogue/Assembly/DatasetAutocomplete";

import axios from "axios";
const { Option } = Select;

class SourceSeelect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sources: [],
      visible: false,
      loading: false,
    };
  }

  componentDidMount = () => {
    this.getSources();
  };

  componentDidUpdate = (prevProps) => {
    if (
      _.get(prevProps, "catalogueKey") !== _.get(this.props, "catalogueKey")
    ) {
      this.getSources();
    }
  };
  getSources = () => {
    const { catalogueKey } = this.props;
    this.setState({ loading: true });
    axios(
      `${config.dataApi}dataset?contributesTo=${catalogueKey}&limit=1000`
    ).then((res) =>
      this.setState({
        sources: _.get(res, "data.result") ? _.get(res, "data.result") : [],
        loading: false,
      })
    );
  };
  hide = () => {
    this.setState({
      visible: false,
    });
  };

  handleVisibleChange = (visible) => {
    this.setState({ visible });
  };

  onSourceChange = (newDatasetKey) => {
    const { setDataset } = this.props;
    const {
      match: {
        params: { key },
      },
      catalogueKey,
    } = this.props;
    const { sources } = this.state;
    const selectedSource = sources.find((c) => c.key === newDatasetKey);
    if (
      catalogueKey &&
      selectedSource &&
      _.get(this.props, "location.pathname").indexOf(
        `catalogue/${catalogueKey}/dataset/`
      ) > -1
    ) {
      const newPath = _.get(this.props, "location.pathname").replace(
        `catalogue/${catalogueKey}/dataset/${key}/`,
        `catalogue/${catalogueKey}/dataset/${newDatasetKey}/`
      );
      history.push({
        pathname: newPath,
      });
    } else if (catalogueKey) {
      setDataset(selectedSource);
      history.push({
        pathname: `/catalogue/${catalogueKey}/dataset/${newDatasetKey}/issues`,
      });
    }

    this.setState({ visible: false });
  };
  render = () => {
    const { dataset } = this.props;
    const { sources, loading } = this.state;
    return (
      <React.Fragment>
        <a
          onClick={(e) => {
            e.stopPropagation();
            this.setState({ visible: true });
          }}
        >
          <SearchOutlined />
        </a>
        <Modal
          title="Select source"
          visible={this.state.visible}
          maskClosable={true}
          onCancel={this.hide}
          footer={null}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
            }}
          >
            <Select
              showSearch
              loading={loading}
              style={{ width: "100%" }}
              value={dataset ? dataset.key : null}
              placeholder="Select source"
              optionFilterProp="children"
              onChange={this.onSourceChange}
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
              onDropdownVisibleChange={(open) => {
                if (open) {
                  this.getSources();
                }
              }}
            >
              {sources.map((c) => (
                <Option
                  onClick={(e) => {
                    e.domEvent.stopPropagation();
                    e.domEvent.nativeEvent.stopImmediatePropagation();
                  }}
                  value={c.key}
                  key={c.key}
                >{`${c.alias ? c.alias + " " : ""}[${c.key}]`}</Option>
              ))}
            </Select>
          </div>
        </Modal>
      </React.Fragment>
    );
  };
}
const mapContextToProps = ({
  catalogueKey,
  catalogue,
  setDataset,
  user,
  dataset,
}) => ({
  catalogueKey,
  catalogue,
  setDataset,
  user,
  dataset,
});
export default withContext(mapContextToProps)(withRouter(SourceSeelect));
