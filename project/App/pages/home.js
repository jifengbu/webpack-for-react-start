import React, { Component } from "react";
import module_test from "module_test";
import styles from "./home.less";

export default class Home extends Component {
    render() {
        module_test();
        return (
            <div>
                <h1 className={styles.title}>Home</h1>
                <h1 className={styles.fang}>Home</h1>
            </div>
        )
    }
}
