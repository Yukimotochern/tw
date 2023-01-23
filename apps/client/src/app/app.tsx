// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';

import { Route, Routes, Link } from 'react-router-dom';
import { trpc } from '../trpc/client';

export function App() {
  return (
    <>
      <div />
      <br />
      <hr />
      <br />
      <div role="navigation" className="flex-row bg-inherit">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/page-2">Page 2</Link>
          </li>
        </ul>
      </div>
      <button
        onClick={async () => {
          try {
            const kk = await Promise.all([trpc.kk.ff.query('kjlkjlk')]);
            console.log(kk);
          } catch (err) {
            console.log(err);
          }
        }}
      >
        trigger api
      </button>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              This is the generated root route.{' '}
              <Link to="/page-2">Click here for page 2.</Link>
            </div>
          }
        />
        <Route
          path="/page-2"
          element={
            <div>
              <Link to="/">Click here to go back to root page.</Link>
            </div>
          }
        />
      </Routes>
      {/* END: routes */}
    </>
  );
}

export default App;
