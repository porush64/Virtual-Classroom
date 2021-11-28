import { Avatar, Button, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import db, { storage } from "../../lib/firebase";
import "./style.css";
import firebase from "firebase";
import { useLocalContext } from "../../context/context";
import { Announcement } from "..";

const Forum = ({ classData }) => {
  const { loggedInMail, loggedInUser } = useLocalContext();
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInput] = useState("");
  const [image, setImage] = useState(null);
  const [owner, setOwner] = useState(false);
  const [allowed, setAllowed] = useState(false);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleForum = (e) => {
    e.preventDefault();
    if (owner === false) {
      db.collection("Blocked")
        .doc(classData.owner)
        .collection(classData.id)
        .doc(loggedInMail)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setAllowed(false);
          } else {
            setAllowed(true);
          }
        });
    } else {
      setAllowed(true);
    }
    setShowInput(true);
  };

  const handleCloseForum = (e) => {
    e.preventDefault();
    setShowInput(false);
    setAllowed(false);
    setInput("");
    setImage(null);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    setShowInput(false);
    if (image === null) {
      db.collection("Forum")
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
              db.collection("Forum")
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
          {showInput && allowed ? (
            <div className="main__form">
              <TextField
                id="filled-multiline-flexible"
                multiline
                label="Post Something to Class Forum"
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
                  <Button onClick={(e) => handleCloseForum(e)}>Cancel</Button>

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
            <div className="main__wrapper100" onClick={(e) => handleForum(e)}>
              <Avatar src={loggedInUser?.photoURL} />
              <div>Post Something to Class Forum</div>
            </div>
          )}
        </div>
      </div>
      <Announcement classData={classData} dbCollection={"Forum"} />
    </div>
  );
};

export default Forum;
