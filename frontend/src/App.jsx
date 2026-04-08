import React from 'react';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';

function App() {
  return (
    <>
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '10px',
          },
          success: {
            iconTheme: {
              primary: '#A7F3D0',
              secondary: '#064E3B',
            },
            style: {
              background: '#047857',
            }
          },
          error: {
            style: {
              background: '#B91C1C',
            }
          }
        }}  
      />
      <Home />
    </>
  );
}

export default App;
