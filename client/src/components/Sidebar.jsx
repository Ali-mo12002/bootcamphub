import React from 'react';
import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards } from "react-icons/hi";
import styles from '../styles/sidebar.module.css';

const Sidebars = () => {
  return (
    <div className={styles.sidebar}>
      <Sidebar aria-label="Sidebar with logo branding example">
        <Sidebar.Items className={styles.sidebaritems}>
          <Sidebar.ItemGroup className={styles.sidebaritemgroup}>
            <Sidebar.Item href="/" icon={HiChartPie} className={styles.sidebaritem}>
              Home
            </Sidebar.Item>
            <Sidebar.Item href="/network" icon={HiViewBoards} className={styles.sidebaritem}>
              Network
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={HiInbox} className={styles.sidebaritem}>
              Job Postings
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={HiUser} className={styles.sidebaritem}>
              Bootcamps
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={HiShoppingBag} className={styles.sidebaritem}>
              Profile
            </Sidebar.Item>
           
            <Sidebar.Item href="#" icon={HiTable} className={styles.sidebaritem}>
              Sign Out
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
}

export default Sidebars;
