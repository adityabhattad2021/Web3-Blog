import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Web3Button, useAccount } from "@web3modal/react";
import Link from "next/link";
import { css } from "@emotion/css";
import { ownerAddress } from "../config";
import "easymde/dist/easymde.min.css";
import { useState } from "react";

export default function Home() {
	const { account } = useAccount();

	return (
		<div>
			{/* <nav className={nav}>
				<div className={header}>
          <Link>
            <a>
              <img
                src='./logo.svg'
                alt='Web3 Blog Logo'
                style={{width:'50px'}}
              />
            </a>
          </Link>
          <Link>
            <a>
              <div className={titleContainer}>
                <h2 className={title}>Decentralized Blog</h2>
                <p className={description}>WEB3</p>
              </div>
            </a>
          </Link>
          {
            !account.isConnected && (
              <div>
                <Web3Button />
              </div>
            )
          }
          {
            account.isConnected && <p className={accountInfo}>{account.address}</p>
          }
        </div>
        <div>

        </div>
			</nav> */}
		</div>
	);
}
