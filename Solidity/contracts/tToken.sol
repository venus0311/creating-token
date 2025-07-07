// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

interface IUniswapV2Router02 {
    function factory() external pure returns (address);

    function WETH() external pure returns (address);

    function addLiquidityETH(
        address token,
        uint256 amountTokenDesired,
        uint256 amountTokenMin,
        uint256 amountETHMin,
        address to,
        uint256 deadline
    )
        external
        payable
        returns (uint256 amountToken, uint256 amountETH, uint256 liquidity);

    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external;
}

interface IUniswapV2Factory {
    function createPair(
        address tokenA,
        address tokenB
    ) external returns (address pair);
}

interface IFeeReceiver {
    function confirm() external payable returns (bool);
}

contract RexasErc20 is IERC20, Ownable(msg.sender) {
    uint256 public constant VERSION = 1;

    mapping(address => uint256) private _rOwned;
    mapping(address => uint256) private _tOwned;
    mapping(address => mapping(address => uint256)) private _allowances;

    mapping(address => bool) private _isExcludedFromFee;
    mapping(address => bool) private _isExcluded;
    address[] private _excluded;

    uint256 private constant MAX = ~uint256(0);
    uint256 private _tTotal;
    uint256 private _rTotal;
    uint256 private _tFeeTotal;

    string private _name;
    string private _symbol;
    uint8 private _decimals;

    uint256 public _reflectionFee;
    uint256 private _previousReflectionFee = _reflectionFee;

    uint256 public _liquidityFee;
    uint256 private _previousLiquidityFee = _liquidityFee;

    uint256 public _treasuryFee;
    uint256 private _previousTreasuryFee = _treasuryFee;

    uint256 public _burnFee;
    uint256 private _previousBurnFee = _burnFee;

    bool public _applyReflectionFeeToAll;
    bool public _applyLiquidityFeeToAll;
    bool public _applyTreasuryFeeToAll;
    bool public _applyBurnFeeToAll;

    IUniswapV2Router02 public uniswapV2Router;
    address public uniswapV2Pair;
    address public _treasuryAddress;

    bool inSwapAndLiquify;
    bool public swapAndLiquifyEnabled;

    uint256 private numTokensSellToAddToLiquidity;

    event MinTokensBeforeSwapUpdated(uint256 minTokensBeforeSwap);
    event SwapAndLiquifyEnabledUpdated(bool enabled);
    event SwapAndLiquify(
        uint256 tokensSwapped,
        uint256 ethReceived,
        uint256 tokensIntoLiqudity
    );

    modifier lockTheSwap() {
        inSwapAndLiquify = true;
        _;
        inSwapAndLiquify = false;
    }

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

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 totalSupply_,
        address router_,
        address treasuryAddress_,
        FeeSettings memory feeSettings,
        address serviceFeeReceiver_,
        uint256 serviceFee_
    ) payable {
        if (treasuryAddress_ == address(0)) {
            require(
                feeSettings.treasuryFeeBps == 0,
                "Cant set both treasury address to address 0 and treasury percent more than 0"
            );
        }
        require(
            feeSettings.reflectionFeeBps +
                feeSettings.liquidityFeeBps +
                feeSettings.treasuryFeeBps +
                feeSettings.burnFeeBps <=
                10 ** 4 / 4,
            "Total fee is over 25%"
        );

        _name = name_;
        _symbol = symbol_;
        _decimals = 9;

        _tTotal = totalSupply_;
        _rTotal = (MAX - (MAX % _tTotal));

        _reflectionFee = feeSettings.reflectionFeeBps;
        _previousReflectionFee = _reflectionFee;

        _liquidityFee = feeSettings.liquidityFeeBps;
        _previousLiquidityFee = _liquidityFee;

        _treasuryAddress = treasuryAddress_;
        _treasuryFee = feeSettings.treasuryFeeBps;
        _previousTreasuryFee = _treasuryFee;

        _burnFee = feeSettings.burnFeeBps;
        _previousBurnFee = _burnFee;

        _applyReflectionFeeToAll = feeSettings.applyReflectionFeeToAll;
        _applyLiquidityFeeToAll = feeSettings.applyLiquidityFeeToAll;
        _applyTreasuryFeeToAll = feeSettings.applyTreasuryFeeToAll;
        _applyBurnFeeToAll = feeSettings.applyBurnFeeToAll;

        numTokensSellToAddToLiquidity = (totalSupply_ * 5) / 10 ** 4; // 0.05%

        swapAndLiquifyEnabled = true;

        _rOwned[owner()] = _rTotal;

        IUniswapV2Router02 _uniswapV2Router = IUniswapV2Router02(router_);
        // Create a uniswap pair for this new token
        uniswapV2Pair = IUniswapV2Factory(_uniswapV2Router.factory())
            .createPair(address(this), _uniswapV2Router.WETH());

        // set the rest of the contract variables
        uniswapV2Router = _uniswapV2Router;

        // exclude owner and this contract from fee
        _isExcludedFromFee[owner()] = true;
        _isExcludedFromFee[address(this)] = true;

        emit Transfer(address(0), owner(), _tTotal);

        bool result = IFeeReceiver(serviceFeeReceiver_).confirm{
            value: serviceFee_
        }();
        require(result, "invalid fee value");
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function decimals() public view returns (uint8) {
        return _decimals;
    }

    function totalSupply() public view override returns (uint256) {
        return _tTotal;
    }

    function balanceOf(address account) public view override returns (uint256) {
        if (_isExcluded[account]) return _tOwned[account];
        return tokenFromReflection(_rOwned[account]);
    }

    function transfer(
        address recipient,
        uint256 amount
    ) public override returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }

    function allowance(
        address owner,
        address spender
    ) public view override returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(
        address spender,
        uint256 amount
    ) public override returns (bool) {
        _approve(_msgSender(), spender, amount);
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public override returns (bool) {
        _transfer(sender, recipient, amount);
        _approve(
            sender,
            _msgSender(),
            _allowances[sender][_msgSender()] - amount
        );
        return true;
    }

    function increaseAllowance(
        address spender,
        uint256 addedValue
    ) public virtual returns (bool) {
        _approve(
            _msgSender(),
            spender,
            _allowances[_msgSender()][spender] + addedValue
        );
        return true;
    }

    function decreaseAllowance(
        address spender,
        uint256 subtractedValue
    ) public virtual returns (bool) {
        _approve(
            _msgSender(),
            spender,
            _allowances[_msgSender()][spender] - subtractedValue
        );
        return true;
    }

    function isExcludedFromReward(address account) public view returns (bool) {
        return _isExcluded[account];
    }

    function totalFees() public view returns (uint256) {
        return _tFeeTotal;
    }

    function deliver(uint256 tAmount) public {
        address sender = _msgSender();
        require(
            !_isExcluded[sender],
            "Excluded addresses cannot call this function"
        );
        FeeValues memory values = _getValues(tAmount);
        _rOwned[sender] = _rOwned[sender] - values.rAmount;
        _rTotal = _rTotal - values.rAmount;
        _tFeeTotal = _tFeeTotal + tAmount;
    }

    function reflectionFromToken(
        uint256 tAmount,
        bool deductTransferFee
    ) public view returns (uint256) {
        require(tAmount <= _tTotal, "Amount must be less than supply");
        if (!deductTransferFee) {
            FeeValues memory values = _getValues(tAmount);
            return values.rAmount;
        } else {
            FeeValues memory values = _getValues(tAmount);
            return values.rTransferAmount;
        }
    }

    function tokenFromReflection(
        uint256 rAmount
    ) public view returns (uint256) {
        require(
            rAmount <= _rTotal,
            "Amount must be less than total reflections"
        );
        uint256 currentRate = _getRate();
        return rAmount / currentRate;
    }

    function excludeFromReward(address account) public onlyOwner {
        require(!_isExcluded[account], "Account is already excluded");
        if (_rOwned[account] > 0) {
            _tOwned[account] = tokenFromReflection(_rOwned[account]);
        }
        _isExcluded[account] = true;
        _excluded.push(account);
    }

    function includeInReward(address account) external onlyOwner {
        require(_isExcluded[account], "Account is already excluded");
        for (uint256 i = 0; i < _excluded.length; i++) {
            if (_excluded[i] == account) {
                _excluded[i] = _excluded[_excluded.length - 1];
                _tOwned[account] = 0;
                _isExcluded[account] = false;
                _excluded.pop();
                break;
            }
        }
    }

    function _transferBothExcluded(
        address sender,
        address recipient,
        uint256 tAmount
    ) private {
        FeeValues memory values = _getValues(tAmount);
        _tOwned[sender] = _tOwned[sender] - tAmount;
        _rOwned[sender] = _rOwned[sender] - values.rAmount;
        _tOwned[recipient] = _tOwned[recipient] + values.tTransferAmount;
        _rOwned[recipient] = _rOwned[recipient] + values.rTransferAmount;
        _takeLiquidity(values.tLiquidity);
        _takeTreasuryFee(values.tTreasury);
        _takeBurnFee(values.tBurn);
        _reflectFee(values.rFee, values.tFee);
        emit Transfer(sender, recipient, values.tTransferAmount);
    }

    function excludeFromFee(address account) public onlyOwner {
        _isExcludedFromFee[account] = true;
    }

    function includeInFee(address account) public onlyOwner {
        _isExcludedFromFee[account] = false;
    }

    function setFeePercents(
        uint256 reflectionFeeBps,
        uint256 liquidityFeeBps,
        uint256 treasuryFeeBps,
        uint256 burnFeeBps
    ) external onlyOwner {
        require(
            reflectionFeeBps + liquidityFeeBps + treasuryFeeBps + burnFeeBps <=
                10 ** 4 / 4,
            "Total fee is over 25%"
        );
        _reflectionFee = reflectionFeeBps;
        _liquidityFee = liquidityFeeBps;
        _treasuryFee = treasuryFeeBps;
        _burnFee = burnFeeBps;
    }

    function setTreasuryAddress(address treasuryAddress) external onlyOwner {
        require(
            treasuryAddress != address(0),
            "Treasury address cannot be zero address"
        );
        _treasuryAddress = treasuryAddress;
    }

    function setSwapAndLiquifyEnabled(bool _enabled) public onlyOwner {
        swapAndLiquifyEnabled = _enabled;
        emit SwapAndLiquifyEnabledUpdated(_enabled);
    }

    //to receive ETH from uniswapV2Router when swapping
    receive() external payable {}

    function _reflectFee(uint256 rFee, uint256 tFee) private {
        _rTotal = _rTotal - rFee;
        _tFeeTotal = _tFeeTotal + tFee;
    }

    function _getValues(
        uint256 tAmount
    ) private view returns (FeeValues memory) {
        FeeValues memory values;
        (
            values.tTransferAmount,
            values.tFee,
            values.tLiquidity,
            values.tTreasury,
            values.tBurn
        ) = _getTValues(tAmount);
        (values.rAmount, values.rTransferAmount, values.rFee) = _getRValues(
            tAmount,
            values.tFee,
            values.tLiquidity,
            values.tTreasury,
            values.tBurn,
            _getRate()
        );
        return values;
    }

    function _getTValues(
        uint256 tAmount
    ) private view returns (uint256, uint256, uint256, uint256, uint256) {
        uint256 tFee = (tAmount * _reflectionFee) / (10 ** 4);
        uint256 tLiquidity = (tAmount * _liquidityFee) / (10 ** 4);
        uint256 tTreasuryFee = (tAmount * _treasuryFee) / (10 ** 4);
        uint256 tBurnFee = (tAmount * _burnFee) / (10 ** 4);
        uint256 tTransferAmount = tAmount -
            tFee -
            tLiquidity -
            tTreasuryFee -
            tBurnFee;
        return (tTransferAmount, tFee, tLiquidity, tTreasuryFee, tBurnFee);
    }

    function _getRValues(
        uint256 tAmount,
        uint256 tFee,
        uint256 tLiquidity,
        uint256 tTreasury,
        uint256 tBurn,
        uint256 currentRate
    ) private pure returns (uint256, uint256, uint256) {
        uint256 rAmount = tAmount * currentRate;
        uint256 rFee = tFee * currentRate;
        uint256 rLiquidity = tLiquidity * currentRate;
        uint256 rTreasury = tTreasury * currentRate;
        uint256 rBurn = tBurn * currentRate;
        uint256 rTransferAmount = rAmount -
            rFee -
            rLiquidity -
            rTreasury -
            rBurn;

        return (rAmount, rTransferAmount, rFee);
    }

    function _getRate() private view returns (uint256) {
        (uint256 rSupply, uint256 tSupply) = _getCurrentSupply();
        return rSupply / tSupply;
    }

    function _getCurrentSupply() private view returns (uint256, uint256) {
        uint256 rSupply = _rTotal;
        uint256 tSupply = _tTotal;
        for (uint256 i = 0; i < _excluded.length; i++) {
            if (
                _rOwned[_excluded[i]] > rSupply ||
                _tOwned[_excluded[i]] > tSupply
            ) return (_rTotal, _tTotal);
            rSupply = rSupply - _rOwned[_excluded[i]];
            tSupply = tSupply - _tOwned[_excluded[i]];
        }
        if (rSupply < _rTotal / _tTotal) return (_rTotal, _tTotal);
        return (rSupply, tSupply);
    }

    function _takeLiquidity(uint256 tLiquidity) private {
        uint256 currentRate = _getRate();
        uint256 rLiquidity = tLiquidity * currentRate;
        _rOwned[address(this)] = _rOwned[address(this)] + rLiquidity;
        if (_isExcluded[address(this)])
            _tOwned[address(this)] = _tOwned[address(this)] + tLiquidity;
    }

    function _takeTreasuryFee(uint256 tTreasury) private {
        if (tTreasury > 0) {
            uint256 currentRate = _getRate();
            uint256 rTreasury = tTreasury * currentRate;
            _rOwned[_treasuryAddress] = _rOwned[_treasuryAddress] + rTreasury;
            if (_isExcluded[_treasuryAddress])
                _tOwned[_treasuryAddress] = _tOwned[_treasuryAddress] + tTreasury;
            emit Transfer(_msgSender(), _treasuryAddress, tTreasury);
        }
    }

    function _takeBurnFee(uint256 tBurn) private {
        if (tBurn > 0) {
            uint256 currentRate = _getRate();
            uint256 rBurn = tBurn * currentRate;
            _rTotal = _rTotal - rBurn;
            _tTotal = _tTotal - tBurn;
            emit Transfer(_msgSender(), address(0), tBurn);
        }
    }

    function removeAllFee() private {
        if (
            _reflectionFee == 0 &&
            _liquidityFee == 0 &&
            _treasuryFee == 0 &&
            _burnFee == 0
        ) return;

        _previousReflectionFee = _reflectionFee;
        _previousLiquidityFee = _liquidityFee;
        _previousTreasuryFee = _treasuryFee;
        _previousBurnFee = _burnFee;

        _reflectionFee = 0;
        _liquidityFee = 0;
        _treasuryFee = 0;
        _burnFee = 0;
    }

    function restoreAllFee() private {
        _reflectionFee = _previousReflectionFee;
        _liquidityFee = _previousLiquidityFee;
        _treasuryFee = _previousTreasuryFee;
        _burnFee = _previousBurnFee;
    }

    function isExcludedFromFee(address account) public view returns (bool) {
        return _isExcludedFromFee[account];
    }

    function _approve(address owner, address spender, uint256 amount) private {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    function _transfer(address from, address to, uint256 amount) private {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");
        require(amount > 0, "Transfer amount must be greater than zero");

        // is the token balance of this contract address over the min number of
        // tokens that we need to initiate a swap + liquidity lock?
        // also, don't get caught in a circular liquidity event.
        // also, don't swap & liquify if sender is uniswap pair.
        uint256 contractTokenBalance = balanceOf(address(this));

        bool overMinTokenBalance = contractTokenBalance >=
            numTokensSellToAddToLiquidity;
        if (
            overMinTokenBalance &&
            !inSwapAndLiquify &&
            from != uniswapV2Pair &&
            swapAndLiquifyEnabled
        ) {
            contractTokenBalance = numTokensSellToAddToLiquidity;
            //add liquidity
            swapAndLiquify(contractTokenBalance);
        }

        //indicates if fee should be deducted from transfer
        bool takeFee = true;

        //if any account belongs to _isExcludedFromFee account then remove the fee
        if (_isExcludedFromFee[from] || _isExcludedFromFee[to]) {
            takeFee = false;
        }

        //transfer amount, it will take tax, burn, liquidity fee
        _tokenTransfer(from, to, amount, takeFee);
    }

    function swapAndLiquify(uint256 contractTokenBalance) private lockTheSwap {
        // split the contract balance into halves
        uint256 half = contractTokenBalance / 2;
        uint256 otherHalf = contractTokenBalance - half;

        // capture the contract's current ETH balance.
        // this is so that we can capture exactly the amount of ETH that the
        // swap creates, and not make the liquidity event include any ETH that
        // has been manually sent to the contract
        uint256 initialBalance = address(this).balance;

        // swap tokens for ETH
        swapTokensForEth(half); // <- this breaks the ETH -> HATE swap when swap+liquify is triggered

        // how much ETH did we just swap into?
        uint256 newBalance = address(this).balance - initialBalance;

        // add liquidity to uniswap
        addLiquidity(otherHalf, newBalance);

        emit SwapAndLiquify(half, newBalance, otherHalf);
    }

    function swapTokensForEth(uint256 tokenAmount) private {
        // generate the uniswap pair path of token -> weth
        address[] memory path = new address[](2);
        path[0] = address(this);
        path[1] = uniswapV2Router.WETH();

        _approve(address(this), address(uniswapV2Router), tokenAmount);

        // make the swap
        uniswapV2Router.swapExactTokensForETHSupportingFeeOnTransferTokens(
            tokenAmount,
            0, // accept any amount of ETH
            path,
            address(this),
            block.timestamp
        );
    }

    function addLiquidity(uint256 tokenAmount, uint256 ethAmount) private {
        // approve token transfer to cover all possible scenarios
        _approve(address(this), address(uniswapV2Router), tokenAmount);

        // add the liquidity
        uniswapV2Router.addLiquidityETH{value: ethAmount}(
            address(this),
            tokenAmount,
            0, // slippage is unavoidable
            0, // slippage is unavoidable
            owner(),
            block.timestamp
        );
    }

    //this method is responsible for taking all fee, if takeFee is true
    function _tokenTransfer(
        address sender,
        address recipient,
        uint256 amount,
        bool takeFee
    ) private {
        if (!takeFee) removeAllFee();

        _applyConditionalFees(sender, recipient);

        if (_isExcluded[sender] && !_isExcluded[recipient]) {
            _transferFromExcluded(sender, recipient, amount);
        } else if (!_isExcluded[sender] && _isExcluded[recipient]) {
            _transferToExcluded(sender, recipient, amount);
        } else if (!_isExcluded[sender] && !_isExcluded[recipient]) {
            _transferStandard(sender, recipient, amount);
        } else if (_isExcluded[sender] && _isExcluded[recipient]) {
            _transferBothExcluded(sender, recipient, amount);
        } else {
            _transferStandard(sender, recipient, amount);
        }

        restoreAllFee();
    }

    function _applyConditionalFees(address sender, address recipient) private {
        if (
            !_applyReflectionFeeToAll &&
            (sender != uniswapV2Pair && recipient != uniswapV2Pair)
        ) {
            _reflectionFee = 0;
        }
        if (
            !_applyLiquidityFeeToAll &&
            (sender != uniswapV2Pair && recipient != uniswapV2Pair)
        ) {
            _liquidityFee = 0;
        }
        if (
            !_applyTreasuryFeeToAll &&
            (sender != uniswapV2Pair && recipient != uniswapV2Pair)
        ) {
            _treasuryFee = 0;
        }
        if (
            !_applyBurnFeeToAll &&
            (sender != uniswapV2Pair && recipient != uniswapV2Pair)
        ) {
            _burnFee = 0;
        }
    }

    function _transferStandard(
        address sender,
        address recipient,
        uint256 tAmount
    ) private {
        FeeValues memory values = _getValues(tAmount);
        _rOwned[sender] = _rOwned[sender] - values.rAmount;
        _rOwned[recipient] = _rOwned[recipient] + values.rTransferAmount;
        _takeLiquidity(values.tLiquidity);
        _takeTreasuryFee(values.tTreasury);
        _takeBurnFee(values.tBurn);
        _reflectFee(values.rFee, values.tFee);
        emit Transfer(sender, recipient, values.tTransferAmount);
    }

    function _transferToExcluded(
        address sender,
        address recipient,
        uint256 tAmount
    ) private {
        FeeValues memory values = _getValues(tAmount);
        _rOwned[sender] = _rOwned[sender] - values.rAmount;
        _tOwned[recipient] = _tOwned[recipient] + values.tTransferAmount;
        _rOwned[recipient] = _rOwned[recipient] + values.rTransferAmount;
        _takeLiquidity(values.tLiquidity);
        _takeTreasuryFee(values.tTreasury);
        _takeBurnFee(values.tBurn);
        _reflectFee(values.rFee, values.tFee);
        emit Transfer(sender, recipient, values.tTransferAmount);
    }

    function _transferFromExcluded(
        address sender,
        address recipient,
        uint256 tAmount
    ) private {
        FeeValues memory values = _getValues(tAmount);
        _tOwned[sender] = _tOwned[sender] - tAmount;
        _rOwned[sender] = _rOwned[sender] - values.rAmount;
        _rOwned[recipient] = _rOwned[recipient] + values.rTransferAmount;
        _takeLiquidity(values.tLiquidity);
        _takeTreasuryFee(values.tTreasury);
        _takeBurnFee(values.tBurn);
        _reflectFee(values.rFee, values.tFee);
        emit Transfer(sender, recipient, values.tTransferAmount);
    }

    function setApplyReflectionFeeToAll(bool applyToAll) external onlyOwner {
        _applyReflectionFeeToAll = applyToAll;
    }

    function setApplyLiquidityFeeToAll(bool applyToAll) external onlyOwner {
        _applyLiquidityFeeToAll = applyToAll;
    }

    function setApplyTreasuryFeeToAll(bool applyToAll) external onlyOwner {
        _applyTreasuryFeeToAll = applyToAll;
    }

    function setApplyBurnFeeToAll(bool applyToAll) external onlyOwner {
        _applyBurnFeeToAll = applyToAll;
    }
}
