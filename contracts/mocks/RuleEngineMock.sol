//SPDX-License-Identifier: MPL-2.0

pragma solidity ^0.8.17;

import "../interfaces/IRule.sol";
import "../interfaces/IRuleEngine.sol";
import "./RuleMock.sol";
import "./CodeList.sol";

contract RuleEngineMock is IRuleEngine, CodeList {
    IRule[] internal _rules;

    constructor() {
        _rules.push(new RuleMock());
    }

    function setRules(IRule[] calldata rules_) external override {
        _rules = rules_;
    }

    function rulesCount() external view override returns (uint256) {
        return _rules.length;
    }

    function rule(uint256 ruleId) external view override returns (IRule) {
        return _rules[ruleId];
    }

    function rules() external view override returns (IRule[] memory) {
        return _rules;
    }

    function detectTransferRestriction(
        address _from,
        address _to,
        uint256 _amount
    ) public view override returns (uint8) {
        uint256 ruleArrayLength = _rules.length;
        for (uint256 i = 0; i < ruleArrayLength; ++i) {
            uint8 restriction = _rules[i].detectTransferRestriction(
                _from,
                _to,
                _amount
            );
            if (restriction != NO_ERROR) {
                return restriction;
            }
        }
        return 0;
    }

    function validateTransfer(
        address _from,
        address _to,
        uint256 _amount
    ) public view override returns (bool) {
        return detectTransferRestriction(_from, _to, _amount) == 0;
    }

    /**
    @dev
    For all the rules, each restriction code has to be unique.
    */
    function messageForTransferRestriction(
        uint8 _restrictionCode
    ) public view override returns (string memory) {
        uint256 ruleArrayLength = _rules.length;
        for (uint256 i = 0; i < ruleArrayLength; ++i) {
            if (_rules[i].canReturnTransferRestrictionCode(_restrictionCode)) {
                return
                    _rules[i].messageForTransferRestriction(_restrictionCode);
            }
        }
        return "Unknown restriction code";
    }
}
