import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
} from "@material-ui/core";
import React, { useState } from "react";
import { useLocalContext } from "../../context/context";
import Form from "./Form";
import "./style.css";
const CreateClass = () => {
  const { createClassDialog, setCreateClassDialog } = useLocalContext();
  const [check, setChecked] = useState(false);
  const [showForm, setShowForm] = useState(false);
  return (
    <div>
      <Dialog
        onClose={() => setCreateClassDialog(false)}
        aria-labelledby="customized-dialog-title"
        open={createClassDialog}
        maxWidth={showForm ? "lg" : "xs"}
        className="form__dialog"
      >
        {showForm ? (
          <Form />
        ) : (
          <>
            <div className="class__title">
              Do you Want to create a classroom ?
            </div>
            <DialogContent className="class__content">
              <div className="class__text">
                <p>
                  Please know that classroom can only be created for educational
                  purposes and any misuse will call for strict action against
                  the students involved. If you want to proceed, Please confirm
                  by checking the dialog box below
                </p>
                <div className="class__checkboxWrapper">
                  <Checkbox
                    color="primary"
                    onChange={() => setChecked(!check)}
                  />
                  <p>
                    I confirm that I have read the above instructions and will
                    be held responsible in case of any misuse.
                  </p>
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={() => setCreateClassDialog(false)}>
                Close
              </Button>

              <Button
                autoFocus
                color="primary"
                disabled={!check}
                onClick={() => setShowForm(true)}
              >
                Continue
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
};

export default CreateClass;
