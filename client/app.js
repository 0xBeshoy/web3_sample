const web3 = new Web3(window.ethereum)

window.userWalletAddress = null;
const loginButton = document.getElementById("loginButton");
const userWallet = document.getElementById('userWallet');
const chainId = document.getElementById('chainId');
const getValueBtn = document.getElementById('getValue');
const setValueBtn = document.getElementById('setValue');
const valueHolder = document.getElementById('valueHolder');
const setValueBox = document.getElementById('setValueBox');

let mainNet = "0x1";
let ropstenNet = "0x3"
let ganacheNet = "0x539";


// chainId.innerText = "Please Connect to Ropsten"

//Get ABI file and parse it
// function load(){
//     fetch('./abi/file.json')
//     .then(response => response.json())
//     .then(json => console.log(json['abi']));
// }

// Getting the contract JSON file 
let SimpleStorageContract;
async function load() {
    SimpleStorageContract = await (await fetch('./abi/SimpleStorage.json')).json();
    //console.log(data.abi)
    // debugger
    //console.log(SimpleStorageContract.abi)


}


function toggleButton() {
    if (!window.ethereum) {
        loginButton.innerText = "MetaMask isn't installed"
        loginButton.classList.remove('bg-purple-500', 'text-white')
        loginButton.classList.add('bg-gray-500', 'text-gray-100', 'cursor-not-allowed')

        return false;
    }

    loginButton.addEventListener("click", loginWithMetaMask);
    window.ethereum.enable();

}

// Loging in with MetaMask and creating contract instance
/**
 * Defining contract variables
 */
let contractAddress;
let contractInstance;

async function loginWithMetaMask() {
    const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        })
        .catch((err) => {
            console.error(err.message);
            return
        })
    if (!accounts) {
        return
    }

    window.userWalletAddress = accounts[0];
    userWallet.innerText = `${window.userWalletAddress}`
    loginButton.innerText = 'Sign out of MetaMask'

    loginButton.removeEventListener('click', loginWithMetaMask)
    setTimeout(() => {
        loginButton.addEventListener('click', signOutOfMetaMask)
    }, 200)

    // Get the Contract Instance
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = SimpleStorageContract.networks[networkId]
    contractAddress = deployedNetwork.address

    contractInstance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        contractAddress
    )
    // console.log(contractInstance)
    await getNetworkName()
    await whenAccountChange()
    await whenNetworkChange()
    // debugger
    // console.log(networkName)
    return contractInstance

}


// Interact with the get() method of the smartcontract
let result;
async function getStoredData() {

    await contractInstance.methods.get().call({
            from: userWalletAddress
        })
        .then(function (_result) {
            // debugger
            //console.log(_result);
            result = _result;
        })
}

getValueBtn.addEventListener('click', async () => {
    // debugger
    await getStoredData();
    valueHolder.innerText = result;
})


// Interact with the set() method of the smartcontract
async function setStoredData(_value) {
    await contractInstance.methods.set(_value).send({
            from: userWalletAddress
        })
        .then(async function (receipt) {
            console.log(await receipt)
        })
}


setValueBtn.addEventListener('click', async () => {
    let _value = parseInt(setValueBox.value);
    valueHolder.innerText = await setStoredData(_value);
    await getStoredData();
    valueHolder.innerText = result;
    setValueBox.value = ""

})


// Sign-out of MetaMask
function signOutOfMetaMask() {
    window.userWalletAddress = null
    userWallet.innerText = ''
    loginButton.innerText = 'Sign in with MetaMask'
    valueHolder.innerText = '---'
    setValueBox.value = ''

    loginButton.removeEventListener('click', signOutOfMetaMask)
    setTimeout(() => {
        loginButton.addEventListener('click', loginWithMetaMask)
    }, 200)
}


// Events that will fire when changing account or network

// FIXME:
// If the client is connected to the correct network at app initialization, the message of "Connected to Ropsten" will not appear, addEventListener
// If the user is connected to any network, the message will not appear, the user has to change to the network so the message will apear, and this isn't the intended functionality

async function whenAccountChange() {
    await window.ethereum.on('accountsChanged', function (accounts) {
        // console.log("Account changed")
        window.userWalletAddress = accounts[0];
        userWallet.innerText = `${window.userWalletAddress}`

    })
};

async function whenNetworkChange() {
    await window.ethereum.on('chainChanged', (_chainId) => {
        // window.location.reload()
        console.log(_chainId);
        if (_chainId == ropstenNet) {
            chainId.innerText = "Connected to Ropsten";
            chainId.classList.remove('bg-red-500', 'text-white')
            chainId.classList.add('bg-green-500', 'text-white')
            loginButton.classList.remove('bg-gray-500', 'text-gray-100', 'cursor-not-allowed')
            loginButton.classList.add('bg-purple-500', 'text-white')
            loginButton.disabled = false;

        } else {
            signOutOfMetaMask();
            chainId.innerText = "Connected to wrong network, please connect to Ropsten";
            chainId.classList.remove('bg-green-500', 'text-white')
            chainId.classList.add('bg-red-500', 'text-white')
            loginButton.classList.remove('bg-purple-500', 'text-white')
            loginButton.classList.add('bg-gray-500', 'text-gray-100', 'cursor-not-allowed')
            loginButton.disabled = true;
        }
    })
};


//Get network name
let networkName;
async function getNetworkName() {
    await web3.eth.net.getNetworkType()
        .then(data => networkName = data)
}


window.addEventListener("DOMContentLoaded", toggleButton);