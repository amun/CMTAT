//SPDX-License-Identifier: MPL-2.0

pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Create2.sol";
import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import "../modules/CMTAT_BASE.sol";
import "../libraries/FactoryErrors.sol";

/**
* @notice Factory to deploy CMTAT with a transparent proxy
* 
*/
contract CMTAT_FACTORY is AccessControl {
    /// @dev Role to deploy CMTAT
    bytes32 public constant CMTAT_DEPLOYER_ROLE = keccak256("CMTAT_DEPLOYER_ROLE");
    address public immutable logic;
    address[] public cmtats;
    mapping(bytes32 => bool) private salts;
    
    struct CMTAT_data{
        address admin;
        string nameIrrevocable;
        string symbolIrrevocable;
        uint8 decimalsIrrevocable;
        string tokenId;
        string terms;
        string information; 
        uint256 flag;
    }
    event CMTATdeployed(address indexed CMTAT, uint256 id);

    /**
    * @param logic_ contract implementation
    * @param factoryAdmin admin
    */
    constructor(address logic_, address factoryAdmin) {
        if (logic_ == address(0)) {
            revert  FactoryErrors.CMTAT_Factory_AddressZeroNotAllowedForLogicContract();
        }
        if (factoryAdmin == address(0)) {
            revert  FactoryErrors.CMTAT_Factory_AddressZeroNotAllowedForFactoryAdmin();
        }
        logic = logic_;
        _grantRole(DEFAULT_ADMIN_ROLE, factoryAdmin);
        _grantRole(CMTAT_DEPLOYER_ROLE, factoryAdmin);
    }
    
    /**
    * @notice deploy a transparent proxy with a proxy admin contract
    */
    function deployCMTAT(
        bytes32 salt,
        address proxyAdmin,
        CMTAT_data calldata cmtatData
    ) public onlyRole(CMTAT_DEPLOYER_ROLE) returns(address cmtat) {
        if (salts[salt]) {
            revert FactoryErrors.CMTAT_Factory_SaltAlreadyUsed();
        }
        salts[salt] = true;
        bytes memory bytecode = _getBytecode(proxyAdmin, cmtatData);
        cmtat = _deployBytecode(bytecode, salt);
        return cmtat;
    }

    /**
    * @param salt deployment's salt
    * @param proxyAdmin admin of the proxy
    * @param cmtatData token data for the function initialize
    * @notice get the proxy address depending on a particular salt
    */
    function computeProxyAddress( 
        bytes32 salt,
        address proxyAdmin,
        CMTAT_data calldata cmtatData
    ) public view returns (address) {
        bytes memory bytecode = _getBytecode(proxyAdmin, cmtatData);
        return Create2.computeAddress(
            salt,
            keccak256(bytecode),
            address(this)
        );
    }

    function _getBytecode(
        address proxyAdmin,
        CMTAT_data calldata cmtatData
    ) internal view returns(bytes memory bytecode) {
        bytes memory implementation = _encodeImplementationData(
            cmtatData.admin,
            cmtatData.nameIrrevocable,
            cmtatData.symbolIrrevocable,
            cmtatData.decimalsIrrevocable,
            cmtatData.tokenId,
            cmtatData.terms,
            cmtatData.information,
            cmtatData.flag
        );
        bytecode = abi.encodePacked(
            type(TransparentUpgradeableProxy).creationCode,
            abi.encode(
                logic,
                proxyAdmin,
                implementation
            )
        );
    }

    function _encodeImplementationData( 
        address admin,
        string memory nameIrrevocable,
        string memory symbolIrrevocable,
        uint8 decimalsIrrevocable,
        string memory tokenId_,
        string memory terms_,
        string memory information_, 
        uint256 flag_
    ) internal pure returns(bytes memory) {
        return abi.encodeWithSelector(
            CMTAT_BASE(address(0)).initialize.selector,
            admin,
            nameIrrevocable,
            symbolIrrevocable,
            decimalsIrrevocable,
            tokenId_,
            terms_,
            information_, 
            flag_
        );
    }

    function _deployBytecode(
        bytes memory bytecode,
        bytes32  deploymentSalt
    ) internal returns (address cmtat) {
        cmtat = Create2.deploy(0, deploymentSalt, bytecode);
        cmtats.push(address(cmtat));
        emit CMTATdeployed(cmtat, cmtats.length - 1);
        return cmtat;
    }
}