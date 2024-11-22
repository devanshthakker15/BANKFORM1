import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchActiveStores } from "../redux/storeSlice";
import SelectInput from "./SelectInput";

interface ModalProps {
  title: string;
  isVisible: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, isVisible, onClose }) => {
  const dispatch = useAppDispatch();
  const { stores, loading } = useAppSelector((state) => state.store);

  useEffect(() => {
    if (isVisible) dispatch(fetchActiveStores());
  }, [isVisible, dispatch]);

  const storeOptions = stores.map((store) => ({
    value: store.id,
    label: store.store_name,
  }));

  return (
    <div
      className={`modal fade ${isVisible ? "show d-block" : ""}`}
      tabIndex={-1}
      style={{ display: isVisible ? "block" : "none" }}
      role="dialog"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {loading ? (
              <p>Loading stores...</p>
            ) : (
              <SelectInput
                name="store"
                label="Select Store"
                options={storeOptions}
                onChange={(selected) => console.log("Selected:", selected)}
              />
            )}
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
