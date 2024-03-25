import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";

import { Grid } from "semantic-ui-react";
import ProfileBio from "../../components/ProfileBio/ProfileBio";
import ProfilePostDisplay from "../../components/ProfilePostDisplay/ProfilePostDisplay";
import Header from "../../components/Header/Header";

import tokenService from "../../utils/tokenService";
import PostFeed from "../../components/PostFeed/PostFeed";


export default function ProfilePage({ loggedUser, handleLogout }) {
  const [posts, setPosts] = useState([]);
  const [profileUser, setProfileUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  const { username } = useParams();

  console.log(username);

  useEffect(() => {
    getProfileInfo();
  }, [username]);

  async function getProfileInfo() {
    try {
      
      const response = await fetch(`/api/users/${username}`, {
        method: "GET",
        headers: {
          
          Authorization: "Bearer " + tokenService.getToken(), 
        
        },
      });
    
      if (!response.ok)
        throw new Error("Whatever you put in here goes to the catch block");
     
      const data = await response.json();
      console.log(data);
      setLoading(false);
      setPosts(data.data);
      setProfileUser(data.user);
      setError(""); 
    } catch (err) {
      console.log(err.message);
      setError("Check the Terminal");
      setLoading(false);
    }
  }

  async function addLike(postId){ 
   
    try {
      const response = await fetch(`/api/posts/${postId}/likes`, {
        method: 'POST',
        headers: {
          
          Authorization: "Bearer " + tokenService.getToken(),
         
        }
      })

      const data = await response.json();
      console.log(data, ' response from addLike')
      getProfileInfo(); 
      
    } catch(err){
      console.log(err)
    }
  }

  async function removeLike(likeId){
    try {
      const response = await fetch(`/api/likes/${likeId}`, {
        method: 'DELETE',
        headers: {
          
          Authorization: "Bearer " + tokenService.getToken(),
         
        } 
      })

      const data = await response.json()
      console.log(data, ' response from delete like')
      getProfileInfo(); 
     
    } catch(err){
      console.log(err)
    }
  }

  if (error) {
    return (
      <>
        <Header loggedUser={loggedUser} handleLogout={handleLogout} />
        <h1>{error}</h1>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Header loggedUser={loggedUser} handleLogout={handleLogout} />
        <h1>Loading....</h1>
      </>
    );
  }

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column>
          <Header loggedUser={loggedUser} handleLogout={handleLogout} />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <ProfileBio user={profileUser}/>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row centered>
        <Grid.Column style={{ maxWidth: 750 }}>
         <PostFeed itemsPerRow={5} isProfile={true} posts={posts} addLike={addLike} removeLike={removeLike} loggedUser={loggedUser}/> 
        
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

