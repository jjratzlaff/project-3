import { useState } from "react";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";

import {
	Button,
	Form,
	Grid,
	Header,
	Image,
	Segment,
  } from "semantic-ui-react";

// this hook allows us to navigate programatically
import { useNavigate } from 'react-router-dom'
import userService from "../../utils/userService";

export default function SignUpPage({handleSignUpOrLogin}) {

  const [error, setError] = useState('')

  const [state, setState] = useState({
    username: "",
    email: "",
    password: "",
    passwordConf: "",
    bio: ""
  });

  const [photo, setPhoto] = useState({})

  // initialize the navigate hook from react-router-dom
  const navigate = useNavigate()

  function handleChange(e) {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e){
    e.preventDefault();

    // ===========================================
    // When we send a photo to the express server server
    // from the client (react) code, we have send a certain type 
    // of request. 
    // Multipart/formData request 

    // 1. Change the format of our data into formData objects (Only when sending a photo, otherwise data should be json)
    const formData = new FormData();
    formData.append('photo', photo)

    // =========================================
    formData.append('username', state.username)
    formData.append('email', state.email)
    formData.append('password', state.password)
    formData.append('bio', state.bio)
    // the for loop below is doing what each line above is doing
    // for (let fieldName in state){
    //   formData.append(fieldName, state[fieldName])
    // }

    // ==========================================



    try {
    // 2. Remove the headers on the fetch request (the browser) (in utils/signup)
    // will automatically apply the correct multipart/formdata header
      await userService.signup(formData); // userService is imported at top of file
      handleSignUpOrLogin();// this is destructred in the props
      // and it grabs the token from localstorage and sets the 
      // new user in state!

      // Change the view to the home page!
      navigate('/');// navigate acceps a path defined by a route!

    } catch(err){
      console.log(err.message, " <- this comes from tht throw in utils/signup")
      setError('Check Your Terminal for errors!!!!!!!!!')
    }




     // ===========================================
  }

  function handleFileInput(e){
	console.log(e.target.files)
	setPhoto(e.target.files[0])
  }


  return (
    <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="purple" textAlign="center">
          <Image src="https://i.imgur.com/TM4eA5g.jpg" /> Sign Up
        </Header>
        <Form autoComplete="off" onSubmit={handleSubmit}>
          <Segment stacked>
            <Form.Input
              name="username"
              placeholder="username"
              value={state.username}
              onChange={handleChange}
              required
            />
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
            <Form.Input
              name="passwordConf"
              type="password"
              placeholder="Confirm Password"
              value={state.passwordConf}
              onChange={handleChange}
              required
            />
            <Form.TextArea
              label="bio"
              name="bio"
              value={state.bio}
              placeholder="Tell us more about your dogs..."
              onChange={handleChange}
            />
            <Form.Field>
              <Form.Input
                type="file"
                name="photo"
                placeholder="upload image"
                onChange={handleFileInput}
              />
            </Form.Field>
            <Button type="submit" className="btn">
              Signup
            </Button>
          </Segment>
          {error ? <ErrorMessage error={error} /> : null}
        </Form>
      </Grid.Column>
    </Grid>
  );
}
