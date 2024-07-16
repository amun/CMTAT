//SPDX-License-Identifier: MPL-2.0

pragma solidity 0.8.20;

library Errors {
    error InvalidTransfer(address from, address to, uint256 amount);
    error AddressZeroNotAllowed();
    error SameValue();
}
