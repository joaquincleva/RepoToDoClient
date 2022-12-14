import React, { useContext } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AssistantPhotoIcon from '@mui/icons-material/AssistantPhoto';
import { AuthContext } from "../helpers/AuthContext";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [postObject, setPostObject] = useState({});
  const [classify, setClassify] = useState({
    priority: "", 
    completed: -1, 
    tag: ""
  })
  const { authState } = useContext(AuthContext);
  let navigate = useNavigate();
  const id = authState.id;


  const hoverCompletado = (prop) => {
    if(prop === 1){
      return <button className="completed" onClick={() => {
        editPost("complete");
      }}>Completed</button>
    } else {
      return <button className="uncompleted" onClick={() => {
        editPost("complete");
      }}>Complete</button>
    }
  }

  const showAll =() => {
    setClassify({
      priority: "",
      completed: -1, 
      tag: ""
    })
  }

  const showCategory =(props) => {
    setClassify({
      ...classify,
      tag: props
    })
  }

  const showPriority =(props) => {
    setClassify({
      ...classify,
      priority: props
    })
    console.log(classify.priority)
  }

  const showCompleted =(props) => {
    setClassify({
      ...classify,
      completed: props
    })
  }

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    } else if(classify.priority==="" && classify.completed=== -1 && classify.tag === "") {
      axios.get(`http://localhost:3001/posts/byUserId/${id}`, {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          setListOfPosts(response.data);
        });
    } else if (classify.tag !== "" && classify.priority !== "" && classify.completed !== -1){
      axios.get(`http://localhost:3001/posts/idpriocomptag/${id}/${classify.priority}/${classify.completed}/${classify.tag}`, {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          setListOfPosts(response.data);
        });
    } else if (classify.completed === -1 && classify.priority === "" && classify.tag !== ""){
      axios.get(`http://localhost:3001/posts/idtag/${id}/${classify.tag}`, {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          setListOfPosts(response.data);
        });
    } else if (classify.completed === -1 && classify.tag === "" && classify.priority !== ""){
      axios.get(`http://localhost:3001/posts/idprio/${id}/${classify.priority}`, {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          setListOfPosts(response.data);
        });
    } else if (classify.priority === "" && classify.tag === "" && classify.completed !== -1){
      axios.get(`http://localhost:3001/posts/idcom/${id}/${classify.completed}`, {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          setListOfPosts(response.data);
        });
    } else if (classify.completed === -1 && classify.tag !=="" && classify.priority!==""){
      axios.get(`http://localhost:3001/posts/idpriotag/${id}/${classify.priority}/${classify.tag}`, {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          setListOfPosts(response.data);
        });
    } else if (classify.tag === "" && classify.priority!=="" && classify.completed!== -1){
      axios.get(`http://localhost:3001/posts/idpriocom/${id}/${classify.priority}/${classify.completed}`, {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          setListOfPosts(response.data);
        });
    } else{
      axios.get(`http://localhost:3001/posts/idtagcom/${id}/${classify.tag}/${classify.completed}`, {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          setListOfPosts(response.data);
        });
    }
  }, [classify, id, navigate]);
  

  const showPost = (postId) => {
    axios.get(`http://localhost:3001/posts/byId/${postId}`).then((response) => {
      setPostObject(response.data);
    });
  }

  const deletePost = (id) => {
    axios
      .delete(`http://localhost:3001/posts/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        navigate("/");
      });
  };

  const editPost = (option) => {
    if (option === "title") {
      let newTitle = prompt("Enter New Title:");
      axios.put(
        "http://localhost:3001/posts/title",
        {
          newTitle: newTitle,
          id: postObject.id,
        },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      );

      setPostObject({ ...postObject, title: newTitle });
      navigate("/");
    } else if (option === "body") {
      let newPostText = prompt("Enter New Text:");
      axios.put(
        "http://localhost:3001/posts/postText",
        {
          newText: newPostText,
          id: postObject.id,
        },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      );

      setPostObject({ ...postObject, postText: newPostText });
      navigate("/");
    } else if (option === "tag") {
      let newPostTag = prompt("Enter New Text:");
      axios.put(
        "http://localhost:3001/posts/postTag",
        {
          newPostTag: newPostTag,
          id: postObject.id,
        },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      );

      setPostObject({ ...postObject, tag: newPostTag });
      navigate("/");
    } else {
      if (postObject.completed === 0){
        let completando = 1
        axios.put(
          "http://localhost:3001/posts/completed",
          {
            completado: completando,
            id: postObject.id,
          },
          {
            headers: { accessToken: localStorage.getItem("accessToken") },
          }
        );
  
        setPostObject({ ...postObject, completed: completando });
        navigate("/");
      } else {
        let completando = 0
        axios.put(
          "http://localhost:3001/posts/completed",
          {
            completado: completando,
            id: postObject.id,
          },
          {
            headers: { accessToken: localStorage.getItem("accessToken") },
          }
        );
  
        setPostObject({ ...postObject, completed: completando });
        navigate("/");
      }
    }
  };
  
  return (
    <div className="postPage">
      <div className="leftSide">
        <div>
          <h1>Tasks {classify.tag !== "" ? ("("+classify.tag+")") : ""}</h1>
          <div className="classifier">
            <button className={(classify.completed === -1 && classify.tag === "" && classify.priority === "") ? "classifOrange" : "classifWhite"}
                onClick={() => {
                  showAll();
                }}>All</button>
            <button className={classify.completed === 1 ? "classifOrange" : "classifWhite"}
              onClick={() => {showCompleted(1)}}>Completed</button>
            <button className={classify.completed === 0 ? "classifOrange" : "classifWhite"}
              onClick={() => {showCompleted(0)}}>To Do</button><br/>
            <button onClick={() => {showPriority('High')}}
              className={classify.priority === 'High' ? "classifOrange" : "classifWhite" }>
              <AssistantPhotoIcon className="red" fontSize="small"/>High Priority
            </button>
            <button onClick={() => {showPriority('Medium')}}
              className={classify.priority === 'Medium' ? "classifYellowOrange" :"classif-yellow" }>
              <AssistantPhotoIcon className="yellow" fontSize="small"/>Medium Priority
            </button>
            <button  onClick={() => {showPriority('Low')}}
              className={classify.priority === 'Low' ? "classifOrange" : "classifWhite" }>
              <AssistantPhotoIcon className="blue" fontSize="small" />Low Priority
            </button>
            
          </div>
        </div>
        {listOfPosts.map((value, key) => {
          return (
            <div key={key} className="post">
              <div
                className="body"
                onClick={() => {
                  showPost(value.id);
                }}
              >
                <div className="titled">{value.title}</div>
              </div>
              <div className="footer">
                <div className="username" onClick={() => {
                  showCategory(value.tag);
                }}>
                  {value.tag}
                </div>
                <div className="username">
                  {value.priority}
                </div>
                <div className="username">
                  {value.completed === 0 ? (
                    <>
                      <p>To Do</p>
                    </>
                  ): (
                    <>
                      <p>Completed</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="rightSide">
        <div className="poster" id="individual">
          <div className="title" onClick={() => {
              if (authState.username === postObject.username) {
                editPost("title");
              }
            }}>
            {postObject.title}
          </div>
          <div
            className="body"
            onClick={() => {
              if (authState.username === postObject.username) {
                editPost("body");
              }
            }}
          >
            <p class="postText">  {postObject.postText}</p>
          </div>
          <div className="footer">
            {postObject.id === undefined ? (
              <></>
            ):(
              <>
                <div>
                  <p className="small" onClick={() => {
                    editPost("tag");
                  }}>{postObject.tag}</p>
                </div>
                <div classname="complicado">
                  {hoverCompletado(postObject.completed)}
                </div>
                <button className="delete"
                  onClick={() => {
                    deletePost(postObject.id);
                  }}>
                  {" "}
                  <DeleteForeverIcon className="deleteIcon"/>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;