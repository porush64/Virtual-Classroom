import { Avatar } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import db from "../../lib/firebase";
import "./style.css";
const Announcement = ({ classData, dbCollection }) => {
  const [announcement, setannouncement] = useState([]);

  useEffect(() => {
    if (classData) {
      let unsubscribe = db
        .collection(dbCollection)
        .doc("classes")
        .collection(classData.id)
        .onSnapshot((snap) => {
          setannouncement(snap.docs.map((doc) => doc.data()));
        });
      return () => unsubscribe();
    }
  }, [classData, dbCollection]);

  return (
    <div>
      {announcement.map((item) => (
        <div className="amt" key={item.timestamp}>
          <div className="amt__Cnt">
            <div className="amt__top">
              <Avatar src={item.avatarUrl} />
              <em className="amt__name">{item.name}</em>
            </div>
            <div className="amt__sender">{item.sender}</div>
            <p className="amt__txt">{item.text}</p>
            <a className="amt__img" href={item.imageUrl}>
              {item.imageName}
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Announcement;
