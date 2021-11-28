import { Button, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import ToggleButton from "react-toggle-button";
import db from "../../lib/firebase";
import "./style.css";
import { useLocalContext } from "../../context/context";
import { Forum, ClassNotes } from "..";
const Main = ({ classData }) => {
  const { loggedInMail } = useLocalContext();
  const [owner, setOwner] = useState(false);
  const [userID, setUserID] = useState("");
  const [notesView, setNotesView] = useState(false);

  const Block = (e) => {
    e.preventDefault();

    db.collection("Blocked")
      .doc(loggedInMail)
      .collection(classData.id)
      .doc(userID)
      .get()
      .then((doc) => {
        if (doc.exists === false && userID !== loggedInMail) {
          db.collection("Blocked")
            .doc(loggedInMail)
            .collection(classData.id)
            .doc(userID)
            .set({ block: true });
        } else if (userID !== loggedInMail) {
          db.collection("Blocked")
            .doc(loggedInMail)
            .collection(classData.id)
            .doc(userID)
            .update({
              block: true,
            });
        }
        setUserID("");
      });
  };

  const unBlock = (e) => {
    e.preventDefault();
    db.collection("Blocked")
      .doc(loggedInMail)
      .collection(classData.id)
      .doc(userID)
      .delete()
      .then(() => {
        setUserID("");
      });
  };

  useEffect(() => {
    if (loggedInMail === classData.owner) {
      setOwner(true);
    }
  }, [loggedInMail, classData]);

  return (
    <div className="main">
      <div className="main__wrapper">
        <div className="main__content">
          <div className="main__wrapper1">
            <div className="main__bgImage">
              <div className="main__emptyStyles" />
            </div>
            <div className="main__text">
              <h1 className="main__heading main__overflow">
                {classData.className}
              </h1>
              <div className="main__section main__overflow">
                {classData.section}
              </div>
              <div className="main__wrapper2">
                <em className="main__code">Class Code :</em>
                <div>{classData.id}</div>
                <em className="main__view__changer">
                  Toggle To Change View ClassNotes/Forum
                </em>
                <div className="main__toggle">
                  <ToggleButton
                    colors={{
                      activeThumb: {
                        base: "rgb(250,250,250)",
                      },
                      active: {
                        base: "rgb(207,221,245)",
                        hover: "rgb(177, 191, 215)",
                      },
                      inactive: {
                        base: "rgb(207,221,245)",
                        hover: "rgb(177, 191, 215)",
                      },
                    }}
                    inactiveLabel={""}
                    activeLabel={""}
                    value={notesView}
                    onToggle={() => {
                      setNotesView(!notesView);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="main__announce">
          <div className="main__status">
            {owner ? (
              <div>
                <p>Block User</p>
                <TextField
                  id="filled-basic"
                  label="User ID"
                  className="main__subText"
                  variant="filled"
                  value={userID}
                  onChange={(e) => setUserID(e.target.value)}
                />
                <div className="block">
                  <Button
                    disabled={userID === ""}
                    onClick={Block}
                    color="primary"
                    variant="contained"
                  >
                    Block
                  </Button>
                </div>
                <div className="unblock">
                  <Button
                    disabled={userID === ""}
                    onClick={unBlock}
                    color="primary"
                    variant="contained"
                  >
                    Unblock
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <p>Upcoming</p>
                <p className="main__subText">No work due</p>
              </div>
            )}
          </div>
          {notesView ? (
            <Forum classData={classData} />
          ) : (
            <ClassNotes classData={classData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Main;
