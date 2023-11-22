import { getSecureValue } from './secure.store';
import { Client, Context, LIVE_CONTRACTS } from 'dms-sdk-client';
import '@ethersproject/shims';
import { Wallet } from 'ethers';

export async function getClient() {
  async function fetchKey() {
    let pKey = await getSecureValue('privateKey');
    if (pKey) {
      pKey = pKey.split('0x')[1];
      console.log('pKey :', pKey);
    }
    const address = await getSecureValue('address');

    return { pKey, address };
  }
  const { pKey, address } = await fetchKey();
  function createClient(privateKey) {
    const ctx = new Context({
      network: 24680,
      signer: new Wallet(privateKey),
      web3Providers: web3EndpointsDevnet.working,
      relayEndpoint: relayEndpointsDevnet.working,
      graphqlNodes: grapqhlEndpoints.working,
      ledgerAddress: LIVE_CONTRACTS['bosagora_devnet'].LedgerAddress,
      tokenAddress: LIVE_CONTRACTS['bosagora_devnet'].TokenAddress,
      phoneLinkCollectionAddress:
        LIVE_CONTRACTS['bosagora_devnet'].PhoneLinkCollectionAddress,
      validatorCollectionAddress:
        LIVE_CONTRACTS['bosagora_devnet'].ValidatorCollectionAddress,
      currencyRateAddress:
        LIVE_CONTRACTS['bosagora_devnet'].CurrencyRateAddress,
      shopCollectionAddress:
        LIVE_CONTRACTS['bosagora_devnet'].ShopCollectionAddress,
    });
    return new Client(ctx);
  }
  const client = createClient(pKey);
  console.log('client :', client);
  return { client, address };
}

const web3EndpointsMainnet = {
  working: ['https://mainnet.bosagora.org/'],
  failing: ['https://bad-url-gateway.io/'],
};

const web3EndpointsDevnet = {
  working: ['http://rpc.devnet.bosagora.org:8545/'],
  failing: ['https://bad-url-gateway.io/'],
};

const TEST_WALLET_ADDRESS = '0x64D111eA9763c93a003cef491941A011B8df5a49';
const TEST_WALLET =
  '70438bc3ed02b5e4b76d496625cb7c06d6b7bf4362295b16fdfe91a046d4586c';

const grapqhlEndpoints = {
  working: [
    {
      url: 'http://subgraph.devnet.bosagora.org:8000/subgraphs/name/bosagora/dms-osx-devnet',
    },
  ],
  timeout: [
    {
      url: 'https://httpstat.us/504?sleep=100',
    },
    {
      url: 'https://httpstat.us/504?sleep=200',
    },
    {
      url: 'https://httpstat.us/504?sleep=300',
    },
  ],
  failing: [{ url: 'https://bad-url-gateway.io/' }],
};

const relayEndpointsDevnet = {
  working: 'http://relay.devnet.bosagora.org:7070/',
  failing: 'https://bad-url-gateway.io/',
};
