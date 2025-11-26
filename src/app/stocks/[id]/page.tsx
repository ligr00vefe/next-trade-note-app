import StockClient from "./StockClient";

interface IStockPageProps {
  params: { id: string };
}

const StockPage = ({ params }: IStockPageProps) => {
  const { id } = params;
  return (
    <StockClient id={id} />
  );
};

export default StockPage;