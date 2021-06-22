import React, { useState, useEffect } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import useWindowSize from "components/Hooks/useWindowSize.js";
import Hidden from "@material-ui/core/Hidden";

// @material-ui/icons
import AddIcon from '@material-ui/icons/Add';

// core components
import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/nextjs-material-dashboard/components/headerLinksStyle.js";
import { connectWallet, getCurrentWalletConnected } from '../../ethereum/utils/interact'


export default function AdminNavbarLinks() {
  const size = useWindowSize();
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");

  useEffect(async () => { //TODO: implement
    const { address, status } = await getCurrentWalletConnected();
    setWallet(address)
    setStatus(status);

    addWalletListener();
  }, []);
  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Write a message in the text-field above.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
            🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
            </a>
        </p>
      );
    }
  }

  const connectWalletPressed = async () => { //TODO: implement
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  return (
    <div>

      <div className={classes.manager}>
        <button
          className="tSBKF"
          onClick={connectWalletPressed}
        >

          {walletAddress.length > 0 ? (
            String(walletAddress).substring(0, 6) +
            "..." +
            String(walletAddress).substring(38)
          ) : (
            <span>+ Connect Wallet</span>
          )}
        </button>
      </div>
    </div>
  );
}
