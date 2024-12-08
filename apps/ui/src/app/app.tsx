import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import Home from './pages/home';

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache(),
  name: 'github',
  version: '1.0',
});

export function App() {
  return (
    <ApolloProvider client={client}>
      <Home />
    </ApolloProvider>
  );
}

export default App;
