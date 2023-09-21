import React from 'react';

function App() {
  // Function to handle button clicks and change the URL
  const navigateToPage = (url) => {
    window.location.href = url;
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
      {/* Button 1 */}
      <div>
        <button
          className="btn btn-custom navigation-button mb-4"
          onClick={() => navigateToPage('/allcontacts')}
          style={{ backgroundColor: '#007bff' }} // Change the background color here
        >
          All Contacts
        </button>
      </div>

      {/* Button 2 */}
      <div>
        <button
          className="btn btn-custom navigation-button"
          onClick={() => navigateToPage('/uscontacts')}
          style={{ backgroundColor: '#ff6347' }} // Change the background color here
        >
          US Contacts
        </button>
      </div>
    </div>
  );
}

export default App;
