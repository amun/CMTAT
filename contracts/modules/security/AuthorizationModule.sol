//SPDX-License-Identifier: MPL-2.0

pragma solidity 0.8.17;

import "../../../openzeppelin-contracts-upgradeable/contracts/access/AccessControlUpgradeable.sol";
import "../../../openzeppelin-contracts-upgradeable/contracts/proxy/utils/Initializable.sol";

import "../../libraries/Errors.sol";

abstract contract AuthorizationModule is AccessControlUpgradeable {
    // BurnModule
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    // MintModule
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    // PauseModule
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    function __AuthorizationModule_init(
        address admin
    ) internal onlyInitializing {
        /* OpenZeppelin */
        __Context_init_unchained();
        // AccessControlUpgradeable inherits from ERC165Upgradeable
        __ERC165_init_unchained();
        __AccessControl_init_unchained();

        /* own function */
        __AuthorizationModule_init_unchained(admin);
    }

    /**
     * @dev Grants the different roles to the
     * account that deploys the contract.
     *
     */
    function __AuthorizationModule_init_unchained(
        address admin
    ) internal onlyInitializing {
        if (admin == address(0)) revert Errors.AddressZeroNotAllowed();
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }

    /*
     * @dev Returns `true` if `account` has been granted `role`.
     */
    function hasRole(
        bytes32 role,
        address account
    ) public view virtual override returns (bool) {
        // The Default Admin has all roles
        if (AccessControlUpgradeable.hasRole(DEFAULT_ADMIN_ROLE, account)) {
            return true;
        }
        return AccessControlUpgradeable.hasRole(role, account);
    }

    uint256[50] private __gap;
}
