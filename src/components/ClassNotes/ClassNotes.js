import { Avatar, Button, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import db, { storage } from "../../lib/firebase";
import "./style.css";
import firebase from "firebase";
import { useLocalContext } from "../../context/context";
import { Announcement } from "..";
const ClassNotes = ({ classData }) => {
  const { loggedInMail, loggedInUser } = useLocalContext();
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInput] = useState("");
  const [image, setImage] = useState(null);
  const [owner, setOwner] = useState(false);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleClassNotes = (e) => {
    e.preventDefault();
    setShowInput(true);
  };

  const handleCloseClassNotes = (e) => {
    e.preventDefault();
    setShowInput(false);
    setInput("");
    setImage(null);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    setShowInput(false);
    if (image === null) {
      db.collection("ClassNotes")
        .doc("classes")
        .collection(classData.id)
        .add({
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          imageUrl: null,
          text: inputValue,
          name: loggedInUser.displayName,
          sender: loggedInMail,
          imageName: null,
          avatarUrl: loggedInUser?.photoURL,
        })
        .then(() => {
          setImage(null);
          setInput("");
        });
    } else {
      const uploadImage = storage.ref(`/images/${image.name}`).put(image);

      uploadImage.on(
        "state_changed",
        (snapshot) => {
          console.log(snapshot);
        },
        (err) => {
          console.log(err);
        },
        () => {
          storage
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then((fireBaseUrl) => {
              db.collection("ClassNotes")
                .doc("classes")
                .collection(classData.id)
                .add({
                  timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                  imageUrl: fireBaseUrl,
                  text: inputValue,
                  name: loggedInUser.displayName,
                  sender: loggedInMail,
                  imageName: image.name,
                  avatarUrl: loggedInUser?.photoURL,
                })
                .then(() => {
                  setImage(null);
                  setInput("");
                });
            });
        }
      );
    }
  };

  useEffect(() => {
    if (loggedInMail === classData.owner) {
      setOwner(true);
    }
  }, [loggedInMail, classData]);
  return (
    <div className="main__announcements">
      <div className="main__announcementsWrapper">
        <div className="main__ancContent">
          {showInput && owner ? (
            <div className="main__form">
              <TextField
                id="filled-multiline-flexible"
                multiline
                label="Announce Something to class"
                variant="filled"
                value={inputValue}
                onChange={(e) => setInput(e.target.value)}
              />
              <div className="main__buttons">
                <input
                  onChange={handleChange}
                  variant="outlined"
                  color="primary"
                  type="file"
                />

                <div>
                  <Button onClick={(e) => handleCloseClassNotes(e)}>
                    Cancel
                  </Button>

                  <Button
                    disabled={image === null && inputValue === ""}
                    onClick={(e) => handleUpload(e)}
                    color="primary"
                    variant="contained"
                  >
                    Post
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="main__wrapper100"
              onClick={(e) => handleClassNotes(e)}
            >
              <Avatar src={loggedInUser?.photoURL} />
              {owner ? (
                <div>Announce Something to class</div>
              ) : (
                <div>Sorry, Only Teacher/Owner can Post</div>
              )}
            </div>
          )}
        </div>
      </div>
      <Announcement classData={classData} dbCollection={"ClassNotes"} />
    </div>
  );
};

export default ClassNotes;
