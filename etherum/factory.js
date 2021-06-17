import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    CampaignFactory.abi,
    '0x8030Be462704698c3FDAC9554537139E47BFe28E'
)

export default instance;