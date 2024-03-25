import React from "react";
import "./LoginPage.css";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
  Button,
  Form,
  Grid,
  Header,
  Image,
  Message,
  Segment,
} from "semantic-ui-react";

import userService from "../../utils/userService";

export default function LoginPage({ handleSignUpOrLogin }) {
  const [state, setState] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");


  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      // We always pass in an OBJECT as the data we want to send to the server
      await userService.login(state); // making the http request to the server

      navigate("/");
      handleSignUpOrLogin(); // this comes from app.js as a prop, which it gets the token from localstorage and stores the decoded
      // token in the app.js state
    } catch (err) {
      console.log(err);
      setError("check terminal and console");
    }
  }

  function handleChange(e) {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h3" color="black" textAlign="center">
           Existing User Login
        </Header>
        <Form autoComplete="off" onSubmit={handleSubmit}>
          <Segment stacked>
            <Form.Input
              type="email"
              name="email"
              placeholder="email"
              value={state.email}
              onChange={handleChange}
              required
            />
            <Form.Input
              name="password"
              type="password"
              placeholder="password"
              value={state.password}
              onChange={handleChange}
              required
            />

            <Button type="submit" className="btn">
              Login
            </Button>
          </Segment>
          <Message>
            New?   <Link to="/signup">  Sign up</Link>
          </Message>
          {error ? <ErrorMessage error={error} /> : null}
        </Form>
      </Grid.Column>
    </Grid>
  );
}
