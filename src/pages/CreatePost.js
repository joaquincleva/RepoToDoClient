import React, { useContext, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

function CreatePost() {
  const { authState } = useContext(AuthContext);

  let navigate = useNavigate();
  const initialValues = {
    title: "",
    postText: "",
    tag: "",
    priority: "",
    completed: 0,
  };

  
  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    }
  }, []);
  const validationSchema = Yup.object().shape({
    title: Yup.string().min(3).max(20).required("You must input a Title!"),
    postText: Yup.string().max(400),
    tag: Yup.string().max(15),
    priority: Yup.string().oneOf(['High','Medium','Low'])
  });

  const onSubmit = (data) => {
    axios
      .post("http://localhost:3001/posts", data, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        navigate("/");
      });
  };

  return (
    <div className="createPostPage">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <label>Title: </label>
          <ErrorMessage name="title" component="span" />
          <Field
            id="inputCreatePost"
            name="title"
            placeholder="(Ex. Title...)"
          />
          <label>Post: </label>
          <ErrorMessage name="postText" component="span" />
          <Field
            id="inputCreatePost"
            name="postText"
            placeholder="(Ex. Post...)"
          />
          <label>Category: </label>
          <ErrorMessage name="tag" component="span" />
          <Field
            id="inputCreatePost"
            name="tag"
            placeholder="(Ex. Post...)"
          />
          <label>Priority (Low, Medium or High (The first in upper case and the rest in lower case.)): </label>
          <ErrorMessage name="priority" component="span" />
          <Field
            id="inputCreatePost"
            name="priority"
            placeholder="High, Medium or Low"
          />
          <button type="submit"> Create Post</button>
        </Form>
      </Formik>
    </div>
  );
}

export default CreatePost;

