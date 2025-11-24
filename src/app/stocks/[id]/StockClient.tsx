'use client';

import { useGetAccountEvaluationQuery } from '@/hooks/useAccount';
import { IAccountEvaluationResponse } from '@/lib/type/accountEval';
import React, { useEffect, useState } from 'react'

const StockClient = () => {    
  const [ evaluation, setEvaluation ] = useState<IAccountEvaluationResponse | null>(null);

  const { data } = useGetAccountEvaluationQuery();

  useEffect(() => {
    if (data) {
      setEvaluation(data);
    }
  }, [data]);
  
  console.log('data: ', data);
  console.log('evaluation: ', evaluation);

  return (
    <div>StockClient</div>
  )
}

export default StockClient