import ListClient from './ListClient';
import getStocks from '@/actions/getStocks';

export default async function ListPage() {
  const stocksData = await getStocks();

  return <ListClient stocks={stocksData.data || []} />;
}