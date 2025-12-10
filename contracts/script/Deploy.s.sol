// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {Taskify} from "../src/Taskify.sol";

contract DeployScript is Script {
    Taskify public taskify;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        taskify = new Taskify(5, 1);

        vm.stopBroadcast();
    }
}
