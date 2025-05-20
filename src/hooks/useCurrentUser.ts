import { useSession } from 'next-auth/react';

const useCurrentUser = () => {
  const { data, status } = useSession();
  return {
    user: data?.user,
    status,
    isLoggedIn: !!data?.user,
  };
};

export default useCurrentUser; 