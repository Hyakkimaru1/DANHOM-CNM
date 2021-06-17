import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { DataGrid } from '@material-ui/data-grid';


export default function CustomTable(props) {
  return (
    <div style={{ height: 400 }} >
      <DataGrid rows={props.tableData} columns={props.tableColumn} pageSize={5} />
    </div>
  );
}

CustomTable.defaultProps = {
  tableHeaderColor: "gray",
};

CustomTable.propTypes = {
  tableHeaderColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "gray",
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.string),
  tableData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
};
