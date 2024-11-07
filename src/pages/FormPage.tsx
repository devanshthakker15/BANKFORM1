// src/pages/FormPage.tsx
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
// import OffcanvasForm from '../components/OffcanvasForm';
import { FormData } from '../types/formTypes';

const FormPage: React.FC = () => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [editData, setEditData] = useState<FormData | undefined>(undefined);

  const handleOpen = () => setShowOffcanvas(true);
  const handleClose = () => setShowOffcanvas(false);

  const handleFormSubmit = (newData: FormData) => {
    
    console.log('Form submitted:', newData);
  };

  return (
    <div className="container mt-5">
      <h2>HSN Form Page</h2>
      <Button onClick={handleOpen} className="mb-3">Open HSN Form</Button>
      
      {/* <OffcanvasForm
        show={showOffcanvas}
        handleClose={handleClose}
        title="HSN Form"
        onFormSubmit={handleFormSubmit}
        editData={editData}  // Pass `editData` when needed for edit mode
        onClose={handleClose}
      /> */}
    </div>
  );
};

export default FormPage;
