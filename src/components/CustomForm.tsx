import React from "react";
import { Formik, Form } from "formik";
import { Button } from "react-bootstrap";
import { offcanvasSchema } from "../schema/offcanvasSchema";
import { FormData } from "../types/formTypes";
import { useAppDispatch } from "../redux/hooks";
import { saveHSNCodeAsync } from "../redux/offcanvasSlice";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import { YES_NO } from "../utils/constants";

interface CustomFormProps {
  onClose: () => void;
  editData?: FormData;
}

const CustomForm: React.FC<CustomFormProps> = ({ editData, onClose }) => {
  const dispatch = useAppDispatch();

  return (
    <Formik
      initialValues={{
        hsn_name: editData?.hsn_name || "",
        hsn_code: editData?.hsn_code || "",
        is_active: editData?.is_active ?? null,
      }}
      enableReinitialize={true}
      validationSchema={offcanvasSchema}
      onSubmit={(values: FormData) => {
        console.log("Submitting form with values:", values);
        dispatch(saveHSNCodeAsync(values)); // Dispatch the async action to post the data
        onClose();
      }}
    >
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <div className="mb-3">
            <TextInput
              label="HSN Name"
              placeholder="Enter HSN name"
              name="hsn_name"
              required={true}
            />
          </div>

          <div className="mb-3">
            <TextInput
              label="HSN Code"
              placeholder="Enter HSN code"
              name="hsn_code"
              required={true}
            />
          </div>

          <div className="mb-3">
            <SelectInput label="Is Active" name="is_active" options={YES_NO} />
          </div>

          <div className="row">
            <Button type="submit" className="me-2">
              {editData ? "Update" : "Submit"}
            </Button>
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CustomForm;
