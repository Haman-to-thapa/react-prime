import React from 'react';
import { PrimeReactProvider } from 'primereact/api';
import DataTableComponent from './components/DataTableComponent';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const App: React.FC = () => {
  return (
    <PrimeReactProvider>
      <div className="p-4 bg-surface-100 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-900 mb-4">Artworks</h1>
          <DataTableComponent />
        </div>
      </div>
    </PrimeReactProvider>
  );
};

export default App;