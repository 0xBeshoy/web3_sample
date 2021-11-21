
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