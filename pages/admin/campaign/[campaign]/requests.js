import React, { useState, useEffect } from "react";
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
import { Button } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import Campaign from 'ethereum/campaign';
import { getCurrentWalletConnected } from "../../../../ethereum/utils/interact";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useRouter } from "next/router";
import web3 from "ethereum/web3";

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
    fontWeight: "600",
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
  backdrop: {
    color: '#fff',
    zIndex: 10000
  },
};


function RequestTable({ campaignParam, summary }) {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const [wallet, setWallet] = useState("0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B");
  const [open, setOpen] = useState(true);
  const route = useRouter();
  const [requests, setRequests] = useState([]);
  const campaign = Campaign(campaignParam);


  useEffect(() => {
    const callAPi = async () => {
      try {
        const requestCount = await campaign.methods.getRequestCount().call();
        // get requests
        const requests = await Promise.all(
          Array(parseInt(requestCount)).fill().map((element, index) => {
            return campaign.methods.getRequest(index, wallet).call();
          })
        );

        const requests2 = await Promise.all(
          Array(parseInt(requestCount)).fill().map((element, index) => {
            return campaign.methods.getRequest2(index, wallet).call();
          })
        );

        let newData = [];
        console.log(requests,requests2);
        if (requests && requests.length) {
          for (let i = 0; i < requests.length; i++) {
            newData.push({
              id: i, description: requests[i][0],
              amount: requests[i][1],
              recipient: requests[i][2],
              complete: requests[i][3],
              approvalCount: requests[i][4],
              canApproval: requests[i][5],
              isApproved: requests[i][7],
              canComplete: requests[i][6],
              percent: requests[i][3] === true ? "100%" : Math.floor((summary[1] / (requests[i][1]?requests[i][1]:1)) * 100) + "%",
              percentapproval: Math.floor((requests2[i][0] / requests2[i][1]) * 100) + "%"
            })
          }
        }
        // set data for requests state
        setRequests(newData);
      } catch (err) {
        console.log(err);
      }
      handleClose();
    };
    callAPi();
  }, [wallet]);

  useEffect(async () => { //TODO: implement
    const { address } = await getCurrentWalletConnected();
    setWallet(address);
    addWalletListener();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };

  function addWalletListener() {
    if (window.ethereum) {
      // handle account change
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
        } else {
          setWallet("0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B");
        }

      });
    } else {
    }
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },

    { field: 'description', headerName: 'Description', width: 340 },
    {
      field: 'amount', headerName: 'Amount (Eth)', width: 170, renderCell: (params) => {
        return <p>{web3.utils.fromWei(params.row.amount, 'ether')}</p>;
      }
    },
    { field: 'percent', headerName: 'Percent', width: 150 },
    { field: 'percentapproval', headerName: 'Percent Approval', width: 220 },
    { field: 'recipient', headerName: 'Recipient', width: 450 },
    { field: 'complete', headerName: 'Complete', width: 150, sortable: false },
    { field: 'approvalCount', headerName: 'Approval Count', width: 150 },
    {
      field: 'viewdetail', headerName: 'Approve', width: 260,
      sortable: false,
      renderCell: (params) => {
        let returnValue = null;
        returnValue = (
          <>
            {(params.row.canApproval && !params.row.complete && !params.row.isApproved) ? (<Button variant="contained" color="primary" onClick={async () => {
              handleToggle();
              const accounts = await web3.eth.getAccounts();
              await campaign.methods.approveRequest(params.row.id).send({
                from: accounts[0]
              }).then(async (res) => {

                try {
                  const requestCount = await campaign.methods.getRequestCount().call();
                  // get requests
                  const requests = await Promise.all(
                    Array(parseInt(requestCount)).fill().map((element, index) => {
                      return campaign.methods.getRequest(index, wallet).call();
                    })
                  );
                  const requests2 = await Promise.all(
                    Array(parseInt(requestCount)).fill().map((element, index) => {
                      return campaign.methods.getRequest2(index, wallet).call();
                    })
                  );
                  let newData = [];
                  if (requests && requests.length) {
                    for (let i = 0; i < requests.length; i++) {
                      newData.push({
                        id: i, description: requests[i][0],
                        amount: requests[i][1],
                        recipient: requests[i][2],
                        complete: requests[i][3],
                        approvalCount: requests[i][4],
                        canApproval: requests[i][5],
                        isApproved: requests[i][7],
                        canComplete: requests[i][6],
                        percent: requests[i][3] === true ? "100%" : Math.floor((summary[1] / requests[i][1]) * 100) + "%",
                        percentapproval: Math.floor((requests2[i][0] / requests2[i][1]) * 100) + "%"
                      })
                    }
                  }
                  // set data for requests state
                  setRequests(newData);
                } catch (err) {
                  console.log(err);
                }
                handleClose();
              }).catch(err => {
                console.log(err);
                handleClose();
              });
            }}> Approve</Button>) : <></>}
            &nbsp;&nbsp;
            {
              (params.row.canComplete
                && !params.row.complete ?
                <Button
                  onClick={async () => {
                    handleToggle();
                    await campaign.methods.finalizeRequest(params.row.id).send({
                      from: wallet
                    }).then(async (res) => {

                      try {
                        const requestCount = await campaign.methods.getRequestCount().call();
                        // get requests
                        const requests = await Promise.all(
                          Array(parseInt(requestCount)).fill().map((element, index) => {
                            return campaign.methods.getRequest(index, wallet).call();
                          })
                        );
                        const requests2 = await Promise.all(
                          Array(parseInt(requestCount)).fill().map((element, index) => {
                            return campaign.methods.getRequest2(index, wallet).call();
                          })
                        );
                        let newData = [];
                        if (requests && requests.length) {
                          for (let i = 0; i < requests.length; i++) {
                            newData.push({
                              id: i, description: requests[i][0],
                              amount: requests[i][1],
                              recipient: requests[i][2],
                              complete: requests[i][3],
                              approvalCount: requests[i][4],
                              canApproval: requests[i][5],
                              isApproved: requests[i][7],
                              canComplete: requests[i][6],
                              percent: requests[i][3] === true ? "100%" : Math.floor((summary[1] / requests[i][1]) * 100) + "%",
                              percentapproval: Math.floor((requests2[i][0] / requests2[i][1]) * 100) + "%"
                            })
                          }
                        }
                        // set data for requests state
                        setRequests(newData);
                      } catch (err) {
                        console.log(err);
                      }
                      handleClose();
                    }).catch(err => {
                      console.log(err);
                      handleClose();
                    });
                  }}
                  variant="contained">finalize</Button> : <></>)
            }
          </>
        );

        return returnValue;
      }
    }
  ];

  return (
    <>
      <Button onClick={() => route.back()}>Back</Button>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Backdrop className={classes.backdrop} open={open} onClick={handleClose}>
            <CircularProgress color="inherit" />
          </Backdrop>
          <Card>
            <CardHeader color="primary">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h4 className={classes.cardTitleWhite}>{summary[5]}</h4>
                {
                  wallet !== "" && wallet === summary[4].toLowerCase() ? <Button variant="contained" startIcon={<AddIcon />} onClick={() => route.push(`/admin/campaign/${route.query.campaign}/request/new`)}> Create request </Button> : <></>
                }

              </div>
              <p className={classes.cardCategoryWhite}>
                All requests of the campaign show here
              </p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="primary"
                tableColumn={columns}
                tableData={requests}
              />
            </CardBody>
          </Card>

        </GridItem>
      </GridContainer>
    </>
  );
}

RequestTable.layout = Admin;

RequestTable.getInitialProps = async (props) => {
  const campaign = Campaign(props.query.campaign);
  const summary = await campaign.methods.getSummary().call();
  if (summary) {
    return { summary, campaignParam: props.query.campaign };
  }
  return {
    campaignParam: props.query.campaign, summary: null
  };
}

export default RequestTable;
