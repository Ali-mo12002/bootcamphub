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
            <Sidebar.Item href="#" icon={HiChartPie} className={styles.sidebaritem}>
              Dashboard
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={HiViewBoards} className={styles.sidebaritem}>
              Kanban
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={HiInbox} className={styles.sidebaritem}>
              Inbox
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={HiUser} className={styles.sidebaritem}>
              Users
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={HiShoppingBag} className={styles.sidebaritem}>
              Products
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={HiArrowSmRight} className={styles.sidebaritem}>
              Sign In
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={HiTable} className={styles.sidebaritem}>
              Sign Up
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
}

export default Sidebars;
