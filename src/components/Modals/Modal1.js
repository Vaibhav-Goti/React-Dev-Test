import React, { useEffect, useState, useRef } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Scrollbars } from 'react-custom-scrollbars';
import axios from 'axios';

function ModalScreen() {
  const [loader, setLoader] = useState(true);
  const [initialItems, setInitialItems] = useState([]);
  const [items, setItems] = useState(initialItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);


  const openDetailModal = (item) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  // Function to close the detail modal
  const closeDetailModal = () => {
    setShowDetailModal(false);
  };


  const navigateToPage = (url) => {
    window.location.href = url;
  };

  const containerRef = useRef(null);

  const handleScroll = () => {
    const container = containerRef.current;
    if (
      container.scrollTop + container.clientHeight >= container.scrollHeight - 100
    ) {
      // Scrolled to the bottom with a 100px buffer
      loadMoreData();
    }
  };

  const loadMoreData = () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      const token =
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjU2MCwiZXhwIjoxNzI2NTY3MTc5LCJ0eXBlIjoiYWNjZXNzIiwidGltZXN0YW1wIjoxNjk1MDMxMTc5fQ.0y7NtuVDCvcPvmWbliMs1q02sov2oFC6u2Hi6H4A2W4';
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      axios
        .get(
          `https://api.dev.pastorsline.com/api/contacts.json?companyId=560&query&page=${page}&countryId&noGroupDuplicates=1`,
          { headers }
        )
        .then((response) => {
          const contactsArray = Object.values(response.data.contacts);

          if (contactsArray.length === 0) {
            // No more data to load
            setHasMore(false);
          } else {
            setInitialItems([...initialItems, ...contactsArray]);
            setItems([...items, ...contactsArray]);
            setPage(page + 1);
          }

          setLoader(false);
        })
        .catch((error) => {
          setLoader(false);
        })
        .finally(() => {
          setLoadingMore(false);
        });
    }
  };

  useEffect(() => {
    loadMoreData();
  }, []); // Load initial data

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);

    let filteredItems = initialItems;

    if (isChecked) {
      // If checkbox is checked, filter by even IDs
      filteredItems = filteredItems.filter((item) => item.id % 2 === 0);
    }

    filteredItems = filteredItems.filter((item) => {
      if (
        item &&
        item.first_name &&
        item.phone_number &&
        item.country_id !== null &&
        item.country_id !== undefined
      ) {
        return (
          item.first_name.toLowerCase().includes(searchTerm) ||
          item.phone_number.includes(searchTerm) ||
          item.country_id.toString().includes(searchTerm)
        );
      }
      return false;
    });

    setItems(filteredItems);
  };

  return (
    <div className="container">
      <Modal show={true} backdrop="static">
        <Modal.Body>
          <div>
            <h2>All Contacts</h2>
            <div className="mb-1 mt-4">
              <input
                type="text"
                placeholder="Search..."
                className="form-control"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            {loader ? (
              <div className="d-flex justify-content-center align-items-center">
                <p>Loading...</p>
              </div>
            ) : (
              <Scrollbars
                ref={containerRef}
                style={{
                  width: '100%',
                  height: 300,
                  marginTop: 10,
                  marginBottom: 30,
                }}
                onScroll={handleScroll}
              >
                <div className="list-group mr-2 list-group-flush">
                  {/* Headings */}
                  <div className="list-group-item list-group-item-action">
                    <div className="d-flex justify-content-between align-items-center">
                      <div style={{ flex: 2, fontWeight: 700 }}>Names</div>
                      <div style={{ flex: 2, fontWeight: 700 }}>Phone</div>
                      <div style={{ flex: 1, fontWeight: 700 }}>Country</div>
                    </div>
                  </div>

                  {/* Data Rows */}
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="list-group-item list-group-item-action"
                      onClick={() => {
                        // Handle click action if needed
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center" onClick={() => openDetailModal(item)}>
                        <div style={{ flex: 2 }}>{item.first_name}</div>
                        <div style={{ flex: 2 }}>{item.phone_number}</div>
                        <div style={{ flex: 1 }}>{item.country_id}</div>
                      </div>
                    </div>
                  ))}

                  {loadingMore && (
                    <div className="d-flex justify-content-between align-items-center">
                      Loading...
                    </div>
                  )}
                </div>
              </Scrollbars>
            )}
          </div>
          <div className="btn-group" role="group">
            <Button variant="primary mr-2">All Contacts</Button>
            <Button
              onClick={() => navigateToPage('/uscontacts')}
              variant="secondary mr-2"
            >
              US Contacts
            </Button>
            <Button onClick={() => navigateToPage('/')} variant="danger">
              Close
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <Form.Check
            type="checkbox"
            label="Only even"
            checked={isChecked}
            onChange={() => {
              setIsChecked(!isChecked);
              handleSearchChange({ target: { value: searchTerm } });
            }}
          />
        </Modal.Footer>
      </Modal>

      {/* details modal */}
      {/* Detail Modal */}
      <Modal show={showDetailModal} onHide={closeDetailModal}>
        <Modal.Header closeButton>
          <Modal.Title>Contact Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedItem && (
            <div>
              <p>Name: {selectedItem.first_name} {selectedItem.last_name}</p>
              <p>Phone: {selectedItem.phone_number}</p>
              <p>Country Code: {selectedItem.country_id}</p>
              <p>Country: {selectedItem.country && selectedItem.country.iso}</p>
              {selectedItem.email && <p>Email: {selectedItem.email}</p>}
              {selectedItem.address && <p>Address: {selectedItem.address}</p>}
              <p>App Contact IDs: {selectedItem.app_contact_ids.join(', ')}</p>
              <p>Birthday: {selectedItem.birthday ? selectedItem.birthday : 'N/A'}</p>
              <p>Color: {selectedItem.color}</p>
              <p>Comment: {selectedItem.comment}</p>
              <p>Do Not Call: {selectedItem.do_not_call}</p>
              <p>Is Archived: {selectedItem.is_archived}</p>
              <p>Is Breeze: {selectedItem.is_breeze}</p>
              <p>Is CCB: {selectedItem.is_ccb}</p>
              {/* Add more details here as needed */}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDetailModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ModalScreen;
