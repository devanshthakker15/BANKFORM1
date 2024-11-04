// src/pages/HSN_Codes.tsx
import React, { useEffect, useState } from "react";
import { Button, Offcanvas } from "react-bootstrap";
import TextInput from "../components/TextInput";
import SelectInput from "../components/SelectInput";
import { Formik, Form as FormikForm } from "formik";
import { basicSchema } from "../schema/basicSchema";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPen } from "@fortawesome/free-solid-svg-icons";
import Pagination from "../components/Pagination";
import { YES_NO } from "../utils/constants";
import { fetchHSNCodesAsync, setCurrentHSN } from "../redux/offcanvasSlice";
import { submitHSNFormData, apiPut } from "../utils/getApi";
import { offcanvasSchema } from "../schema/offcanvasSchema";

interface HSNFormData {
  hsn_name: string;
  hsn_code: string;
  is_active: number;
}

const HSN_Codes: React.FC = () => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const dispatch = useAppDispatch();
  const { formData, totalCount, currentHSN } = useAppSelector((state) => state.offcanvas);

  const handleClose = () => setShowOffcanvas(false);
  const handleShow = () => {
    setShowOffcanvas(true);
  };

  const handleSubmit = async (values: HSNFormData) => {
    try {
      await submitHSNFormData(values);
      dispatch(fetchHSNCodesAsync({ page: currentPage }));
      handleClose();
    } catch (error) {
      console.error("Failed to submit HSN form data:", error);
    }
  };

  const handleEdit = (data: HSNFormData) => {
    dispatch(setCurrentHSN(data));
    handleShow();
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    dispatch(fetchHSNCodesAsync({ page: newPage }));
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  useEffect(() => {
    dispatch(fetchHSNCodesAsync({ page: currentPage }));
  }, [dispatch, currentPage]);

  const handleToggleActive = async (id: number, currentStatus: number) => {
    const token = localStorage.getItem("access_token") || "";
    const updatedStatus = currentStatus === 1 ? 0 : 1;
    try {
      await apiPut(
        `/api/product/hsncodes/${id}/`,
        { is_active: updatedStatus },
        token
      );
      dispatch(fetchHSNCodesAsync({ page: currentPage }));
    } catch (error) {
      console.error("Failed to toggle bank record status:", error);
    }
  };

  return (
    <div>
      <h1>HSN Codes</h1>
      <Button variant="primary" onClick={handleShow}>
        Add HSN Code
      </Button>

      <div className="table-responsive-mobile mt-4">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>HSN Name</th>
              <th>HSN Code</th>
              <th>Is Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {formData && formData.length > 0 ? (
              formData.map((item, index) => (
                <tr key={index}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{item.hsn_name}</td>
                  <td>{item.hsn_code}</td>
                  <td>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={item.is_active === 1}
                          onChange={() =>
                            handleToggleActive(item.id, item.is_active)
                          }
                        />
                        <span className="slider round"></span>
                      </label>
                    </td>
                  <td>
                    <Button variant="primary" onClick={() => handleEdit(item)} style={{ width: '70px', margin: "4px"}}>
                      <FontAwesomeIcon icon={faPen} />
                    </Button>
                    <Button variant="danger"style={{ width: '70px', margin: "4px"}}>
                      <FontAwesomeIcon icon={faTrashCan} />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <Offcanvas show={showOffcanvas} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{currentHSN ? "Edit HSN Code" : "Add HSN Code"}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Formik
            initialValues={{
              hsn_name: currentHSN?.hsn_name || "",
              hsn_code: currentHSN?.hsn_code || "",
              is_active: currentHSN?.is_active || 1,
            }}
            validationSchema={offcanvasSchema}
            onSubmit={handleSubmit}
          >
            {() => (
              <FormikForm>
                <TextInput
                  label="HSN Name"
                  name="hsn_name"
                  placeholder="Enter HSN Name"
                  required
                />
                <TextInput
                  label="HSN Code"
                  name="hsn_code"
                  placeholder="Enter HSN Code"
                  required
                />
                <div className="mb-3">
                  <SelectInput
                    label="Is Active"
                    name="is_active"
                    options={YES_NO}
                  />
                </div>
                <Button variant="primary" type="submit" className="mt-3">
                  Submit
                </Button>
              </FormikForm>
            )}
          </Formik>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default HSN_Codes;
