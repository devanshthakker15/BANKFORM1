// src/components/OffcanvasForm.tsx
import React from 'react';
import { Offcanvas } from 'react-bootstrap';
import CustomForm from './CustomForm';
import { FormData } from '../types/formTypes';

interface OffcanvasFormProps {
  show: boolean;
  handleClose: () => void;
  title: string;
  onFormSubmit: (newData: FormData) => void;
  editData?: FormData;
}

const OffcanvasForm: React.FC<OffcanvasFormProps> = ({ show, handleClose, title, onFormSubmit, editData }) => {
  return (
    <Offcanvas show={show} onHide={handleClose}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{title}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <CustomForm editData={editData} onClose={handleClose} />
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default OffcanvasForm;
