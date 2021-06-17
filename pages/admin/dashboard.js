// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import DateRange from "@material-ui/icons/DateRange";
import styles from "assets/jss/nextjs-material-dashboard/views/dashboardStyle.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import GridContainer from "components/Grid/GridContainer.js";
// core components
import GridItem from "components/Grid/GridItem.js";
import Table from "components/Table/TableDashboard.js";
// layout for this page
import Admin from "layouts/Admin.js";
import React, { useEffect, useState } from "react";
import { getCurrentWalletConnected } from '../../ethereum/utils/interact';
import web3 from '../../ethereum/web3';
import axios from 'axios'



function Dashboard() {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const [balance, setbalance] = useState()
  const [listTX, setlistTX] = useState([])
  useEffect(async () => {
    const { address, status } = await getCurrentWalletConnected();
    const url = `https://api-rinkeby.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=AE2PE8JY2TQMX26XVQCYXSK7GDTVPDWC6Y`

    if (address) {
      const transactions = await axios.get(url)
      const txlist = transactions.data.result
      txlist?.forEach((item) => {
        item.id = item.blockNumber
        item.value = web3.utils.fromWei(item.value, "ether")
      })
      console.log('%ctransactions ', 'color: blue;', transactions)

      setlistTX(txlist)

      const accounts = await web3.eth.getBalance(address, (err, balance) => {
        const balanceETH = web3.utils.fromWei(balance, "ether")
        console.log('%c balanceETH', 'color: blue;', balanceETH)
        setbalance(parseFloat(balanceETH).toFixed(4))
      });
    }

  }, [])

  return (
    <div>
      <GridContainer alignItems="center">
        <GridItem xs={12} sm={4} md={4}>
          <Card>
            <CardHeader color="dark" stats icon>
              <CardIcon color="dark">
                <AttachMoneyIcon />
              </CardIcon>
              <p className={classes.cardCategory}>Balance</p>
              <h3 className={classes.cardTitle} style={{ fontWeight: "600" }}>{balance} ETH</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <DateRange />
                Last 24 Hours
              </div>
            </CardFooter>
          </Card>
        </GridItem>

      </GridContainer>

      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Your Transactions history</h4>
              <p className={classes.cardCategoryWhite}>
                Click on transactions hash to view detail
              </p>
            </CardHeader>
            <CardBody>
              {listTX && <Table
                tableData={listTX}
              />}
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

Dashboard.layout = Admin;

export default Dashboard;
