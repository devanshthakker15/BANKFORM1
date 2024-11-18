import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPen } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import Pagination from "../components/Pagination";
import TextInput from "../components/TextInput";
import SelectInput from "../components/SelectInput";
import Loader from "../components/Loader";
import Button from "../components/Button";
import { Formik, Form } from "formik";
// import SelectInput from "../components/SelectInput";
import { YES_NO } from "../utils/constants";
import {
  fetchHSNCodesAsync,
  setCurrentHSN,
  toggleHSNActiveStatusAsync,
  saveHSNCodeAsync,
  updateHSNCodeAsync,
  deleteHSNAsync,
} from "../redux/offcanvasSlice";
import { offcanvasSchema } from "../schema/offcanvasSchema";
import { useSearchParams } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumb";

interface HSNFormData {
  hsn_name: string;
  hsn_code: string;
  is_active: number;
}

const HSN_Codes: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  const dispatch = useAppDispatch();
  const { formData, totalCount, currentHSN } = useAppSelector(
    (state) => state.offcanvas
  );

  const handleCloseOffcanvas = () => {
    setShowOffcanvas(false);
    dispatch(setCurrentHSN(null));
  };

  const handleShowOffcanvas = () => {
    setShowOffcanvas(true);
  };

  const handleSubmit = async (values: HSNFormData) => {
    try {
      if (currentHSN) {
        dispatch(updateHSNCodeAsync({ id: currentHSN.id, data: values }));
      } else {
        dispatch(saveHSNCodeAsync(values));
      }
      dispatch(
        fetchHSNCodesAsync({ page: currentPage, query: debouncedQuery })
      );
      handleCloseOffcanvas();
    } catch (error) {
      console.error("Failed to submit HSN form data:", error);
    }
  };

  const handleEdit = (data: HSNFormData) => {
    dispatch(setCurrentHSN(data));
    handleShowOffcanvas();
  };

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  useEffect(() => {
    dispatch(fetchHSNCodesAsync({ page: currentPage, query: debouncedQuery }));
  }, [dispatch, currentPage, debouncedQuery]);

  const handleToggleActive = async (id: number, currentStatus: number) => {
    dispatch(
      toggleHSNActiveStatusAsync({
        id,
        currentStatus,
        page: currentPage,
        query: debouncedQuery,
      })
    );
  };

  const handleDelete = (id: number) => {
    dispatch(deleteHSNAsync({ id, page: currentPage, query: debouncedQuery }));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSearchParams({ page: "1", query: value });
  };

  return (
    <div>
      {/* ... Your other components ... */}
      <div className="container">
        <div className="head d-flex justify-content-between">
          <h1>HSN Codes</h1>
          <Button text="Add HSN Code" variant="primary" onClick={handleShowOffcanvas} />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by Bank Name, Account Holder, Number, or Country"
            className="form-control"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
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
                  <tr key={item.id}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{item.hsn_name}</td>
                    <td>{item.hsn_code}</td>
                    <td>
                      <Button
                        text={item.is_active === 1 ? "Active" : "Inactive"}
                        variant={item.is_active === 1 ? "success" : "danger"}
                        onClick={() =>
                          handleToggleActive(item.id, item.is_active)
                        }
                        style={{ width: "90px", margin: "4px" }}
                      />
                    </td>
                    <td>
                      <Button
                        icon={faPen}
                        variant="primary"
                        onClick={() => handleEdit(item)}
                        style={{ width: "70px", margin: "4px" }}
                      />
                      <Button
                        icon={faTrashCan}
                        variant="danger"
                        onClick={() => handleDelete(item.id)}
                        style={{ width: "70px", margin: "4px" }}
                        disabled={item.is_active !== 1}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>
                    <Loader />
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

        {/* Offcanvas using Bootstrap */}
        <div className={`offcanvas offcanvas-end ${showOffcanvas ? 'show' : ''}`} id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
          <div className="offcanvas-header">
            <h5 id="offcanvasRightLabel">{currentHSN ? "Edit HSN Code" : "Add HSN Code"}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" onClick={handleCloseOffcanvas}></button>
          </div>
          <div className="offcanvas-body">
            <Formik
              initialValues={{
                hsn_name: currentHSN?.hsn_name || "",
                hsn_code: currentHSN?.hsn_code || "",
                is_active: currentHSN?.is_active || 1,
              }}
              validationSchema={offcanvasSchema}
              enableReinitialize
              onSubmit={handleSubmit}
            >
              {() => (
                <Form>
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
                    <SelectInput label="Is Active" name="is_active" options={YES_NO} />
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    text={currentHSN ? "Update" : "Submit"}
                  />
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HSN_Codes;