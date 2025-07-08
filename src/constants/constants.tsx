// for test purpose
// ethereum = sepolia
// bnb = bnb testnet
// 
const contractAddress: {
    [chainId: string]: {
        router: `0x${string}`,
        serviceFeeReceiver: `0x${string}`
    }
} = {
    'ethereum': {
        router: '0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3',
        serviceFeeReceiver: '0xB6125cCD802159906e31F0d90db60Cf513ddcDB3'
    },
    'bsc': {
        router: '0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3',
        serviceFeeReceiver: '0xB6125cCD802159906e31F0d90db60Cf513ddcDB3'
    }
}

// for production purpose
// ethereum = mainnet
//
// const contractAddress = {
//     'ethereum': {
//         router: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
//         serviceFer: '0xB6125cCD802159906e31F0d90db60Cf513ddcDB3'
//     }
// }

export const getContractAddress = (chainId: string) => {
    return contractAddress[chainId];
}