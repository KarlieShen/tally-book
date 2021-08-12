import { get } from '../backend/http';

export const getTallyInfo = async () => {
  const url = 'https://sls-cloudfunction-ap-guangzhou-code-1257714135.cos.ap-guangzhou.myqcloud.com/xmind/tally.json';
  const response = await get(url);
  return response;
}
