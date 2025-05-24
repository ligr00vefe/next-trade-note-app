import ListClient from './ListClient';
import getProducts from '@/actions/getProducts';

export default async function ListPage() {
  const productsData = await getProducts();

  return <ListClient products={productsData.data || []} />;
}