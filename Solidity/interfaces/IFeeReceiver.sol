// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

interface IFeeReceiver {
    struct TokenInfo {
        uint256 createdAt;
        address addr;
        address creator;
        bool enabled;
    }

    event FeeReceived(address indexed, uint256);

    function serviceFee() external view returns (uint256);
    function confirm() external payable returns (bool);
    function withdrawFee() external;
    function withdrawUnrecoverableAsset(address _token) external;
    function addToken(uint256 _createdAt, address _addr, address _owner) external;
    function toggleTokenStatus(uint256 id) external;
    function getTokenList(uint256 size, uint256 cursor) external view returns(TokenInfo[] memory);
    function getTokenListLength() external view returns (uint256);
    function getUserTokenList(address addr, uint256 size, uint256 cursor) external view returns(TokenInfo[] memory);
    function getUserTokenListLength(address addr) external view returns (uint256);
    function setFee(uint256 _fee) external;
} 