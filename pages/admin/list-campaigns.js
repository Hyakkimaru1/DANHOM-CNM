import React, { useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// layout for this page
import Admin from "layouts/Admin.js";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import factory from 'ethereum/factory';
import { Button } from "@material-ui/core";
import { useRouter } from 'next/router';

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF",
    },
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
};


function TableList({ campaigns }) {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const route = useRouter();
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },

    { field: 'name', headerName: 'Name', width: 240 },
    { field: 'addr', headerName: 'Address', flex: 1 },
    {
      field: 'viewdetail', headerName: 'View', width: 120,
      sortable: false,
      renderCell: (params) => {
        return <Button variant="contained" color="primary" onClick={() => route.push(`/admin/campaign/${params.row.addr}`)}> View Detail </Button>;
      }
    }
  ];
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>List campains</h4>
            <p className={classes.cardCategoryWhite}>
              All campains show here
            </p>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="primary"
              tableColumn={columns}
              tableData={campaigns}
            />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}

TableList.layout = Admin;

TableList.getInitialProps = async (prosp) => {
  const campaigns = await factory.methods.getAllCampaigns().call();
  if (campaigns) {
    let newCampaigns = [];
    for (let i = 0; i < campaigns.length; i++) {

      const newObject = {
        id: i,
        addr: campaigns[i].addr,
        description: campaigns[i].description,
        name: campaigns[i].name,
        minimum: campaigns[i].minimum,
      }
      newCampaigns.push(newObject);
    }
    return { campaigns: newCampaigns }
  }
  else return { campaigns: [] }
}

export default TableList;
