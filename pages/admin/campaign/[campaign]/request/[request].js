import React, { useState, useRef } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import Alert from '@material-ui/lab/Alert';
// layout for this page
import Admin from "layouts/Admin.js";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import Campaign from 'ethereum/campaign';
import { useRouter } from 'next/router';
import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import web3 from 'ethereum/web3';

import { Grid } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { TextField } from "@material-ui/core";

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
};

const CampaignPage = ({ summary }) => {
  const useStyles = makeStyles(styles);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const route = useRouter();
  const refInput = useRef(null);
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleSubmit = async event => {
    if (refInput.current.value!==""){
      event.preventDefault();
      setLoading(true);
      const campaign = Campaign(route.query.campaign);
      try {
        const accounts = await web3.eth.getAccounts();
        await campaign.methods.contribute().send({
          from: accounts[0],
          value: web3.utils.toWei(refInput.current.value, 'ether')
        });
  
        route.replaceRoute(`/admin/campaign/${route.query.campaign}`)
      }
      catch (err) {
        console.log(err);
        handleClick();
      }
      setLoading(false);
    }
    else {
      handleClick();
    }
  }

  return summary ? (
    <div>
      <Snackbar anchorOrigin= {{vertical: 'top', horizontal: 'right'}} open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          Somethings is wrong!
        </Alert>
      </Snackbar>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}> {summary[5]}</h4>
              <p className={classes.cardCategoryWhite}>{summary[4]}</p>
            </CardHeader>
            <CardBody>
              <Grid container >
                <Grid item xs={6} sm={6} md={6}>
                  <Button color="primary" onClick={() => route.push(`/admin/campaign/${summary[4]}/requests`)}>All requests ({summary[3]})</Button>
                </Grid>
                <Grid item xs={6} sm={6} md={6} style={{ textAlign: "end" }}>
                  <Button>Minimum Contribution (Wei): {summary[0]}</Button >
                </Grid>
              </Grid>
              <br />
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <InputLabel color="primary" variant="filled">
                    Description
                  </InputLabel>
                  <div>
                    <h5>
                      {summary[6]}
                    </h5>
                  </div>
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card profile>
            <CardAvatar profile>
              <a href="#ethereumImg" onClick={(e) => e.preventDefault()}>
                <img src="https://s2.coinmarketcap.com/static/img/coins/200x200/1027.png" alt="..." />
              </a>
            </CardAvatar>
            <CardBody profile>
              <h5>Contribute to this Campaign</h5>
              <span>Amount to Contribute</span>
              <TextField inputRef={refInput} fullWidth style={{margin:"15px 0px"}} type="number" id="ethereum-amount" label="Ethereum" />
              <Button startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null

              } disable={loading.toString()} onClick={
                handleSubmit
              } variant="contained" color="primary" style={{ borderRadius: "100px", padding: "10px 20px" }}>
                {loading ? "" : "Contribute"}
              </Button>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  ) : <h1>No data</h1>;
}

CampaignPage.layout = Admin;

CampaignPage.getInitialProps = async (props) => {
  const campaign = Campaign(props.query.campaign);
  const summary = await campaign.methods.getSummary().call();
  if (summary) {
    return { summary };
  }
  return { summary: null }
}

export default CampaignPage;
