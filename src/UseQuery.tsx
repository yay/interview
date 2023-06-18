import { Button } from '@mui/material';
import { CSSProperties, useEffect, useMemo, useState } from 'react';

type UseQueryResult = {
  data?: string;
  loading: boolean;
  error?: string;
};

type UseLazyQueryResult = [() => void, UseQueryResult];

type FakeAbortSignal = {
  timeoutId: number;
};

class FakeAbortController {
  id = Math.random();
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

// Automatically execute a query.
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
      // However Promises are not cancellable, but real `fetch` requests are.
      // So we can mimic our fakeFetch to resemble real fetch by implementing our own
      // AbortSignal and AbortController.
      controller.abort();
    };
  }, []);

  return { data, loading, error };
}

// Manually execute a query.
function useLazyQuery(): UseLazyQueryResult {
  const [data, setData] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  // The 'controller' object construction makes the dependencies of useEffect hook change on every render.
  const controller = useMemo(() => new FakeAbortController(), []);

  useEffect(() => {
    return () => {
      controller.abort();
    };
  }, [controller]);

  function execute() {
    controller.abort(); // allow only one fetch at a time
    setLoading(true);
    setData(undefined);
    setError(undefined);

    fakeFetch(controller.signal)
      .then((data) => setData(data))
      .catch((reason) => setError(reason))
      .finally(() => setLoading(false));
  }

  return [execute, { data, loading, error }];
}

const groupStyle: CSSProperties = {
  border: '1px solid black',
  padding: '10px',
  marginBottom: '20px',
};

export const UseQuery: React.FC = () => {
  const { data, loading, error } = useQuery();
  const [fetch, { data: lazyData, loading: lazyLoading, error: lazyError }] = useLazyQuery();
  return (
    <>
      {/* Can't be `Error: {error}` because boolean/undefined/null values are not rendered */}
      <div style={groupStyle}>
        <div>useQuery</div>
        <div>{`Loading: ${loading}`}</div>
        <div>{`Data: ${data}`}</div>
        <div>{`Error: ${error}`}</div>
      </div>
      <div style={groupStyle}>
        <div>
          useLazyQuery <Button onClick={fetch}>Go</Button>
        </div>
        <div>{`Loading: ${lazyLoading}`}</div>
        <div>{`Data: ${lazyData}`}</div>
        <div>{`Error: ${lazyError}`}</div>
      </div>
    </>
  );
};
