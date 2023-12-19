import { getSecureValue } from './secure.store';
import { Client, Context, LIVE_CONTRACTS } from 'dms-sdk-client';
import '@ethersproject/shims';
import { Wallet } from 'ethers';

export async function getClient() {
  async function fetchKey() {
    console.log('getClient > fetchKey');
    let pKey = await getSecureValue('privateKey');
    if (pKey.includes('0x')) {
      // pKey = pKey.split('0x')[1];
      console.log('pKey :', pKey);
    }
    const address = await getSecureValue('address');

    return { pKey, address };
  }
  const { pKey, address } = await fetchKey();
  function createClient(privateKey) {
    console.log(
      'phone link :',
      LIVE_CONTRACTS['bosagora_devnet'].PhoneLinkCollectionAddress,
    );
    const ctx = new Context({
      network: 24680,
      signer: new Wallet(privateKey),
      web3Providers: web3EndpointsDevnet.working,
      relayEndpoint: relayEndpointsDevnet.working,
      graphqlNodes: grapqhlEndpoints.working,
      ledgerAddress: LIVE_CONTRACTS['bosagora_devnet'].LedgerAddress,
      tokenAddress: LIVE_CONTRACTS['bosagora_devnet'].TokenAddress,
      phoneLinkAddress:
        LIVE_CONTRACTS['bosagora_devnet'].PhoneLinkCollectionAddress,
      validatorAddress: LIVE_CONTRACTS['bosagora_devnet'].ValidatorAddress,
      currencyRateAddress:
        LIVE_CONTRACTS['bosagora_devnet'].CurrencyRateAddress,
      shopAddress: LIVE_CONTRACTS['bosagora_devnet'].ShopAddress,
      loyaltyProviderAddress:
        LIVE_CONTRACTS['bosagora_devnet'].LoyaltyProviderAddress,
      loyaltyConsumerAddress:
        LIVE_CONTRACTS['bosagora_devnet'].LoyaltyConsumerAddress,
      loyaltyExchangerAddress:
        LIVE_CONTRACTS['bosagora_devnet'].LoyaltyExchangerAddress,
    });
    return new Client(ctx);
  }
  const client = createClient(pKey);
  console.log('client :', client);
  console.log('>> address :', address);
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
