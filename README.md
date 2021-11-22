## Deployed dApp Links

* Vercel: https://web3-sample.vercel.app/
* Fleek: https://web3-sample.on.fleek.co/
* IPFS Hash: QmWcvq9Tj1TrWJNhBvTakcnSzWCKmytkMe6RVk82iRykeV
* IPFS Gateway: https://ipfs.fleek.co/ipfs/QmWcvq9Tj1TrWJNhBvTakcnSzWCKmytkMe6RVk82iRykeV

## Install dependancies

```code
npm install
```

## Local development
```code
truffle compile --network development
truffle migrate --reset --network development
npm run runAll --> "will copy ABI files after deployment to client folder and run a localhost server"
```

## Deploying on Ropsten
```code
truffle compile --network ropsten
truffle migrate --reset --network ropsten
npm run copy --> "will copy ABI files after deployment to client folder"
````

## Final Contract
EtherScan Link: https://ropsten.etherscan.io/address/0x4546be96527b15601dcdee1d5d07ec231ce06294

## Fleek Link
When changing client dirctory name, update it on the `.fleek.json` file

```json
{
    "build": {
        "baseDir": "client"
    }
}
```
