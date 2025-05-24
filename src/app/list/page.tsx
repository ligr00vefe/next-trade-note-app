import ListClient from './ListClient';
import getTradeList from '@/actions/getTradeList';

export default async function ListPage() {
  const TradeListData = await getTradeList();

  return <ListClient allTradeList={TradeListData.data || []} />;
}