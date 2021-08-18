import { post } from '../backend/http';

const addTally = async (param) => {
  const url = 'https://karlie-service-0g7boclh68f2265a-1257714135.ap-guangzhou.app.tcloudbase.com/tally/add-tally';
  const response = await post(url, param);
  return response;
}
export default addTally;