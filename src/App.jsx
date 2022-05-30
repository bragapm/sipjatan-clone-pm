import './App.css';
import { createClient, Provider } from 'urql';
import Map from './components/Map';
import MapsProvider from './hooks/MapsProvider';
import Nav from './components/Nav';

const client = createClient({
  url: 'https://sipjatan.com/hasura/v1/graphql',
  fetchOptions: () => {
    return {
      headers: { 'x-hasura-admin-secret': 'mg6QxeFFtS_44hEq' },
    };
  },
});
function App() {
  return (
    <>
      <Nav />
      <MapsProvider>
        <Provider value={client}>
          <Map />
        </Provider>
      </MapsProvider>
    </>
  );
}

export default App;
