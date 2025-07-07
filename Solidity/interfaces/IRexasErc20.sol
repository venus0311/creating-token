// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IRexasErc20 is IERC20 {
    struct FeeValues {
        uint256 tTransferAmount;
        uint256 tFee;
        uint256 tLiquidity;
        uint256 tTreasury;
        uint256 tBurn;
        uint256 rAmount;
        uint256 rTransferAmount;
        uint256 rFee;
    }

    struct FeeSettings {
        uint16 reflectionFeeBps;
        bool applyReflectionFeeToAll;
        uint16 liquidityFeeBps;
        bool applyLiquidityFeeToAll;
        uint16 treasuryFeeBps;
        bool applyTreasuryFeeToAll;
        uint16 burnFeeBps;
        bool applyBurnFeeToAll;
    }

    event MinTokensBeforeSwapUpdated(uint256 minTokensBeforeSwap);
    event SwapAndLiquifyEnabledUpdated(bool enabled);
    event SwapAndLiquify(
        uint256 tokensSwapped,
        uint256 ethReceived,
        uint256 tokensIntoLiqudity
    );

    function VERSION() external view returns (uint256);
    function _reflectionFee() external view returns (uint256);
    function _liquidityFee() external view returns (uint256);
    function _treasuryFee() external view returns (uint256);
    function _burnFee() external view returns (uint256);
    function _applyReflectionFeeToAll() external view returns (bool);
    function _applyLiquidityFeeToAll() external view returns (bool);
    function _applyTreasuryFeeToAll() external view returns (bool);
    function _applyBurnFeeToAll() external view returns (bool);
    function uniswapV2Router() external view returns (address);
    function uniswapV2Pair() external view returns (address);
    function _treasuryAddress() external view returns (address);
    function swapAndLiquifyEnabled() external view returns (bool);
    function numTokensSellToAddToLiquidity() external view returns (uint256);
    
    function setFeePercents(uint256 reflectionFee, uint256 liquidityFee, uint256 treasuryFee, uint256 burnFee) external;
    function setTreasuryAddress(address treasuryAddress) external;
    function setSwapAndLiquifyEnabled(bool _enabled) external;
    function excludeFromFee(address account) external;
    function includeInFee(address account) external;
    function excludeFromReward(address account) external;
    function includeInReward(address account) external;
    function swapAndLiquify() external;
    
    function reflectionFromToken(uint256 tAmount, bool deductTransferFee) external view returns (uint256);
    function tokenFromReflection(uint256 rAmount) external view returns (uint256);
    function deliver(uint256 tAmount) external;
    function isExcludedFromReward(address account) external view returns (bool);
    function isExcludedFromFee(address account) external view returns (bool);
    function totalFees() external view returns (uint256);
} 