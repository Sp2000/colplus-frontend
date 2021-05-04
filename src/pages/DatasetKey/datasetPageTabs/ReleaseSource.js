import React from "react";
import config from "../../../config";
import axios from "axios";
import { Alert, Rate, Row, Col } from "antd";
import ErrorMsg from "../../../components/ErrorMsg";
import Metrics from "../../../components/ReleaseSourceMetrics";
import _ from "lodash";
import PresentationItem from "../../../components/PresentationItem";

// import withContext from "../../../components/hoc/withContext";
import TaxonomicCoverage from "../../catalogue/CatalogueSourceMetrics/TaxonomicCoverage";

class ReleaseSource extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      datasetLoading: true,
      data: null,
    };
  }

  componentDidMount = () => {
    this.getData();
  };

  getData = () => {
    const {
      match: {
        params: { taxonOrNameKey: sourceKey },
      },
      datasetKey,
    } = this.props;

    axios(`${config.dataApi}dataset/${datasetKey}/source/${sourceKey}`)
      .then((dataset) => {
        this.setState({ data: dataset.data, datasetError: null });
      })
      .catch((err) => this.setState({ datasetError: err, data: null }));
  };

  render() {
    const { pathToTree, datasetKey } = this.props;
    const { data, datasetError } = this.state;

    return (
      <React.Fragment>
        <div
          className="catalogue-of-life"
          style={{
            background: "#fff",
            padding: 24,
            minHeight: 280,
            margin: "16px 0",
            fontSize: "12px",
          }}
        >
          {datasetError && (
            <Alert message={<ErrorMsg error={datasetError} />} type="error" />
          )}
          {data && (
            <Row>
              <Col span={24}>
                <h2
                  style={{
                    paddingLeft: "10px",
                  }}
                >
                  Source dataset:
                </h2>
              </Col>
              <Col span={12}>
                {/*                 <h1
                  style={{ fontSize: "30px", fontWeight: '400', paddingLeft: "10px" , display: 'inline-block', textTransform: 'none'}}
                  
                    >Database details</h1> */}
                <h1
                  style={{
                    fontSize: "30px",
                    fontWeight: "400",
                    paddingLeft: "10px",
                    display: "inline-block",
                    textTransform: "none",
                  }}
                >
                  {data.title}
                </h1>
              </Col>

              <Col span={12} style={{ textAlign: "right" }}>
                <img
                  src={`${config.dataApi}dataset/${datasetKey}/source/${data.key}/logo?size=MEDIUM`}
                  alt={_.get(data, "title")}
                />
              </Col>
            </Row>
          )}

          {data && (
            <React.Fragment>
              <PresentationItem label="Short name">
                {data.alias}
              </PresentationItem>
              <PresentationItem label="Full name">
                {data.title}
              </PresentationItem>
              <PresentationItem label="Version">
                {(data.version || data.released) &&
                  `${data.version ? data.version : ""}${
                    data.released ? " Received by CoL: " + data.released : ""
                  }`}
              </PresentationItem>
              {data.authors && _.isArray(data.authors) && (
                <PresentationItem label="Authors">
                  {data.authors.map((a) => a.name).join(", ")}
                </PresentationItem>
              )}
              {data.editors && _.isArray(data.editors) && (
                <PresentationItem label="Editors">
                  {data.editors.map((a) => a.name).join(", ")}
                </PresentationItem>
              )}
              <PresentationItem label="Taxonomic coverage">
                <TaxonomicCoverage
                  isProject={false}
                  dataset={data}
                  catalogueKey={datasetKey}
                  pathToTree={pathToTree}
                />
              </PresentationItem>
              <PresentationItem label="English name of the Group">
                {data.group}
              </PresentationItem>
              <Metrics
                catalogueKey={datasetKey}
                dataset={data}
                pathToSearch={`/dataset/${datasetKey}/names`}
              />
              <PresentationItem label="Abstract">
                {data.description}
              </PresentationItem>

              <PresentationItem label="Organisation">
                {_.isArray(data.organisations) &&
                  data.organisations.map((o) => <div>{o.label}</div>)}
              </PresentationItem>
              <PresentationItem label="Website">
                {data.website && (
                  <a href={data.website} target="_blank">
                    {data.website}
                  </a>
                )}
              </PresentationItem>
              {/*  
          <PresentationItem label="Contact">
            {data.contact}
          </PresentationItem>


           <PresentationItem label="Type">
            {data.type}
          </PresentationItem> */}

              <PresentationItem label="Geographic scope">
                {data.geographicScope || "-"}
              </PresentationItem>
              <PresentationItem label="Completeness">
                {data.completeness}
              </PresentationItem>
              <PresentationItem label="Checklist Confidence">
                {<Rate defaultValue={data.confidence} disabled></Rate>}
              </PresentationItem>

              <PresentationItem label="Citation">
                {data.citation || "-"}
              </PresentationItem>

              <PresentationItem label="License">
                {data.license || "-"}
              </PresentationItem>

              {data.gbifKey && (
                <PresentationItem label="GBIF">
                  <a
                    href={`https://www.gbif.org/dataset/${data.gbifKey}`}
                    target="_blank"
                  >
                    Browse in GBIF
                  </a>
                </PresentationItem>
              )}

              {/*           <PresentationItem label="Created">
          {`${data.created} by ${data.createdByUser}`}
          </PresentationItem>
          <PresentationItem label="Modified">
          {`${data.modified} by ${data.modifiedByUser}`}
          </PresentationItem> */}
              {/*           <section className="code-box" style={{marginTop: '32px'}}>
          <div className="code-box-title">Settings</div>
        </section> */}
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default ReleaseSource;
