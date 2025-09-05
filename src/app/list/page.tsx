import ListClient from './ListClient';
import getTradeList from '@/actions/getTradeList';

interface IListPageProps {
  searchParams: {
    limit?: string;
    page?: string;
  };
}

export default async function ListPage({ searchParams }: IListPageProps) {
  // URL 파라미터에서 값 추출 및 기본값 설정
  const limit = searchParams.limit ? parseInt(searchParams.limit) : 10;
  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  // console.log('limit', limit);
  // console.log('page', page);

  // 초기 데이터 로드 (sortBy: createdAt, sortOrder: desc로 고정)
  const TradeListData = await getTradeList({
    limit,
    page,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  return (
    <ListClient 
      initialData={TradeListData.data || []}
      initialLimit={limit}
      initialPage={page}
      initialTotalItems={TradeListData.totalItems}
    />
  );
}