import React, { useEffect } from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import { DataGrid } from '@material-ui/data-grid';
import { useRouter } from 'next/router'
import { Button } from "@material-ui/core";
var units = {
  year: 24 * 60 * 60 * 1000 * 365,
  month: 24 * 60 * 60 * 1000 * 365 / 12,
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000
}

var rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

var getRelativeTime = (d1, d2 = Math.floor(Date.now())) => {
  var elapsed = d1 - d2
  console.log('%c ', 'color: blue;', elapsed)
  // "Math.abs" accounts for both "past" & "future" scenarios
  for (var u in units)
    if (Math.abs(elapsed) > units[u] || u == 'second')
      return rtf.format(Math.round(elapsed / units[u]), u)
}

const url = 'https://rinkeby.etherscan.io/tx/'
export default function TableDB({ tableData }) {
  const route = useRouter();
  const columns = [

    {
      field: 'hash', headerName: 'Hash', flex: 2,
      renderCell: (params) => {
        return <a className="text-overflow" href={url + params.row.hash}> {String(params.row.hash).substring(0, 10) +
          "..." +
          String(params.row.hash).substring(52)} </a>;
      }
    },
    {
      field: 'time', headerName: 'Time', flex: 2,
      renderCell: (params) => {
        return <a href={url + params.row.hash}> {getRelativeTime(params.row.timeStamp * 1000)} </a>;
      }
    },
    { field: 'from', headerName: 'From', flex: 2 },
    { field: 'to', headerName: 'To', flex: 2 },
    { field: 'value', headerName: 'Value', flex: 1.3 },
    // {
    //   field: 'viewdetail', headerName: 'View', width: 120,
    //   sortable: false,
    //   renderCell: (params) => {
    //     return <Button variant="contained" color="primary" onClick={() => route.push(`/admin/campaign/${params.row.address}`)}> View Detail </Button>;
    //   }
    // }
  ];

  useEffect(() => {
    console.log('%c +new Date()', 'color: blue;', +new Date())
  }, []);
  return (
    <div style={{ height: 400 }} >
      <DataGrid rows={tableData} columns={columns} pageSize={5} />
    </div>
  );
}

TableDB.defaultProps = {
  tableHeaderColor: "primary",
};

TableDB.propTypes = {
  tableHeaderColor: PropTypes.oneOf([
    "primary",
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.string),
  tableData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
};
