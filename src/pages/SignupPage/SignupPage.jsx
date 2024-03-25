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


  const navigate = useNavigate()

  function handleChange(e) {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e){
    e.preventDefault();


    const formData = new FormData();
    formData.append('photo', photo)

  
    formData.append('username', state.username)
    formData.append('email', state.email)
    formData.append('password', state.password)
    formData.append('bio', state.bio)
 


    try {
   
      await userService.signup(formData); 
      handleSignUpOrLogin();
     

      
      navigate('/');

    } catch(err){
      console.log(err.message, " <- this comes from tht throw in utils/signup")
      setError('Check Your Terminal for errors!!!!!!!!!')
    }



  }

  function handleFileInput(e){
	console.log(e.target.files)
	setPhoto(e.target.files[0])
  }


  return (
    <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h3" color="black" textAlign="center">
          Sign Up
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
              label="Tell us about yourself"
              name="bio"
              value={state.bio}
              placeholder="Bio"
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
