import { Button } from '@mui/material';
import { useEffect, useState } from 'react';

type UseQueryResult = {
  data?: string;
  loading: boolean;
  error?: string;
};

type FakeAbortSignal = {
  timeoutId: number;
};

class FakeAbortController {
  signal: FakeAbortSignal = {
    timeoutId: 0,
  };
  abort() {
    clearTimeout(this.signal.timeoutId);
  }
}

function fakeFetch(signal: FakeAbortSignal): Promise<string> {
  return new Promise((resolve, reject) => {
    signal.timeoutId = setTimeout(() => {
      if (Math.random() >= 0.5) {
        resolve(JSON.stringify({ status: 'success' }, null, 4));
      } else {
        reject('Server error');
      }
    }, 1000);
  });
}

function useQuery(): UseQueryResult {
  const [data, setData] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  // Using useEffect to only fetch once.
  // In Strict mode it will still fire twice, potentially
  // resulting in both data AND error being printed at the same time.
  // This highlights a potential bug due to the missing cleanup function.
  useEffect(() => {
    const controller = new FakeAbortController();
    fakeFetch(controller.signal)
      .then((data) => setData(data))
      .catch((reason) => setError(reason))
      .finally(() => setLoading(false));
    return () => {
      // We kinda need to cancel the Promise here because React runs
      // one extra setup+cleanup cycle in development for every Effect:
      // https://react.dev/reference/react/StrictMode#fixing-bugs-found-by-re-running-effects-in-development
      // However Promises are not cancellable.
      // Real `fetch` requests are however. So we can mimic our fakeFetch to resemble real fetch by
      // implementing our own AbortSignal and AbortController.
      controller.abort();
    };
  }, []);

  return { data, loading, error };
}

export const UseQuery: React.FC = () => {
  const { data, loading, error } = useQuery();
  return (
    <>
      <Button>Go</Button>
      {/* Can't be `Error: {error}` because boolean/undefined/null values are not rendered */}
      <div>{`Loading: ${loading}`}</div>
      <div>{`Data: ${data}`}</div>
      <div>{`Error: ${error}`}</div>
    </>
  );
};
