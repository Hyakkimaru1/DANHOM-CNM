import React, { useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// layout for this page
import Admin from "layouts/Admin.js";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import TextField from '@material-ui/core/TextField';
import web3 from '../../ethereum/web3';
import factory from '../../ethereum/factory'
import avatar from "assets/img/faces/marc.jpg";
import CircularProgress from '@material-ui/core/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "600",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
};

function UserProfile() {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const [campaignInfo, setcampaignInfo] = useState({})
  const [loading, setloading] = useState(false)
  const handleCreate = async (e) => {
    e.preventDefault();
    setloading(true);
    console.log('%c campaignInfo', 'color: blue;', campaignInfo)

    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods.createCampaign(campaignInfo.minimum, campaignInfo.name, campaignInfo.descriptionCamp).send({
        from: accounts[0]
      }).then((res) => {
        setloading(false)
        toast.success('🦄 Create campaign successfully!');

      });

      // Router.pushRoute('/');
    }
    catch (err) {
      setloading(false)
      toast.error('🦄 Failed!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }



  return (
    <>
      <ToastContainer />
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <form onSubmit={(e) => { handleCreate(e) }}>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Create A New Campaign</h4>
                <p className={classes.cardCategoryWhite}>Complete your campaign infomation</p>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <TextField
                      required
                      onChange={(e) => { setcampaignInfo({ ...campaignInfo, name: e.target.value }) }}
                      style={{ width: "100%" }} type="text" id="standard-basic" label="Name" />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <TextField
                      onChange={(e) => { setcampaignInfo({ ...campaignInfo, descriptionCamp: e.target.value }) }}
                      style={{ width: "100%" }} id="standard-basic" label="Description" />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <TextField
                      required
                      onChange={(e) => { setcampaignInfo({ ...campaignInfo, minimum: e.target.value }) }}
                      style={{ width: "100%" }} type="number" id="standard-basic" label="Minimum Contribute" />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                {loading && <CircularProgress style={{ position: "absolute", marginLeft: "60px" }} color="secondary" />}
                <Button style={{ fontWeight: "600" }} disabled={loading} type="submit" color="primary">
                  Create Campaign</Button>
              </CardFooter>
            </form>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card profile>
            <CardAvatar profile>
              <a href="#pablo" onClick={(e) => e.preventDefault()}>
                <img src="http://topnews.si/wp-content/uploads/2021/05/vitalik_buterin.jpg" alt="..." />
              </a>
            </CardAvatar>
            <CardBody profile>
              <h6 className={classes.cardCategory}>CO-FOUNDER ETHERUM</h6>
              <h4 className={classes.cardTitle}>Vitalik Buterin</h4>
              <p className={classes.description}>
                Don{"'"}t be scared of the truth because we need to restart the
                human foundation in truth And I love you like Kanye loves Kanye
                I love Rick Owens’ bed design but the back is...
              </p>
              <Button color="primary" round>
                Follow
              </Button>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </>
  );
}

UserProfile.layout = Admin;

export default UserProfile;
