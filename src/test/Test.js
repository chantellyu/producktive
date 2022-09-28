import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
//import AddList from "./AddList";
import { Button } from "@mui/material";
import {
  query,
  collection,
  onSnapshot,
  orderBy,
  getDocs,
} from "firebase/firestore";
import "./Test.css";
import OuterTask from "./OuterTask";
import AddList from "./AddList";
import List from "./List";
import { useLocation } from "react-router-dom";

function Test() {
  const [user] = useAuthState(auth);
  //const [loading, setLoading] = useState(false);
  const [addingList, setAddingList] = useState(false);
  const [lists, setLists] = useState([]);
  const toggleAddingList = () => setAddingList(!addingList);
  const location = useLocation();
  const projectName = location.state.projectName;
  const projectId = location.state.projectId;
  console.log(location.state.projectId); //for checking purposes
  console.log(projectName);

  const fetchLists = async () => {
    try {
      const q = query(
        collection(db, "projects", projectId, "lists"),
        orderBy("created", "asc")
      );
      //const docs = await getDocs(q);
      //if (docs.docs.length !== 0) {
      onSnapshot(q, (doc) => {
        setLists(
          doc.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
      });
      //}
      /*setTimeout(function () {
        setLoading(false);
      }, 1000);*/
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching lists");
    }
  };

  useEffect(() => {
    //setLoading(true);
    fetchLists();
  }, [user]);

  return (
    <OuterTask projectName={projectName} projectId={projectId}>
      <div className="flexContainer">
        {lists.map((list) => (
          <List
            key={list.id}
            list={list}
            listId={list.id}
            projectId={projectId}
          />
        ))}
        <div className="addList">
          {addingList ? (
            <AddList
              toggleAddingList={toggleAddingList}
              projectId={projectId}
            />
          ) : (
            <Button
              variant="contained"
              onClick={toggleAddingList}
              sx={{
                width: "300px",
                backgroundColor: "rgba(0, 0, 0, 0.25)",
                ":hover": { backgroundColor: "rgba(0, 0, 0, 0.5)" },
                //textTransform: "none",
              }}
            >
              + Add name
            </Button>
          )}
        </div>
      </div>
    </OuterTask>
  );
}

export default Test;
