import 'regenerator-runtime/runtime';
import * as nearAPI from 'near-api-js';

const CONTRACT_NAME = 'martyr.testnet';

const nearConfig = {
	networkId: 'testnet',
	nodeUrl: 'https://rpc.testnet.near.org',
	contractName: CONTRACT_NAME,
	walletUrl: 'https://wallet.testnet.near.org',
	helperUrl: 'https://helper.testnet.near.org'
};

async function connect() {
  window.near = await nearAPI.connect({
    deps: {
      keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore()
    },
    ...nearConfig
  });

  window.walletConnection = new nearAPI.WalletConnection(window.near);

  window.contract = await new nearAPI.Contract(window.walletConnection.account(), nearConfig.contractName, {
    viewMethods: ['nft_tokens_for_owner'],
    sender: window.walletConnection.getAccountId()
  });
}

function updateUI() {
  if (!window.walletConnection.getAccountId()) {
    Array.from(document.querySelectorAll('.sign-in')).map(it => it.style = 'display: block;');
  } else {
    Array.from(document.querySelectorAll('.after-sign-in')).map(it => it.style = 'display: block;');
	
    contract.nft_tokens_for_owner({ account_id: nearConfig.contractName }).then((data) => {
        console.log(data);
        document.getElementById('image').setAttribute('src', data[0].metadata.media)
	}).catch(console.error);
  }
}

document.querySelector('.sign-in .btn').addEventListener('click', () => {
  walletConnection.requestSignIn(nearConfig.contractName, 'NFT FrontEnd UmNiK');
});

document.querySelector('.sign-out .btn').addEventListener('click', () => {
  walletConnection.signOut();
  window.location.replace(window.location.origin + window.location.pathname);
});

window.nearInitPromise = connect()
    .then(updateUI)
    .catch(console.error);
