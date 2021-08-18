import { get } from '../backend/http';

const getCategoryList = async () => {
  const url = 'https://karlie-service-0g7boclh68f2265a-1257714135.ap-guangzhou.app.tcloudbase.com/tally/get-category-list';
  const response = await get(url);
  return response;
}
export default getCategoryList;

