import React, { useState } from 'react';
import CreateClient from './components/CreateClient';
import ViewClient from './components/ViewClient';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('create');

  const tabs = [
    { id: 'create', label: 'Cadastrar Cliente', component: CreateClient },
    { id: 'view', label: 'Consultar Cliente', component: ViewClient }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <img 
            src={process.env.PUBLIC_URL + "/logo-esimples.png"} 
            alt="eSimples Logo" 
            className="logo"
            style={{ marginBottom: '5px' }}
          />
          <h2 style={{ 
            fontSize: '1.8rem', 
            color: '#2f9a45', 
            fontWeight: '700', 
            marginTop: '5px',
            marginBottom: '0'
          }}>
            Gerenciamento de Clientes - éXMLs
          </h2>
        </header>

        <div className="tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <main>
          {ActiveComponent && <ActiveComponent />}
        </main>
      </div>
    </div>
  );
}

export default App;
