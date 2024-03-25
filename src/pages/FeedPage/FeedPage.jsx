import { useState, useEffect } from 'react'

import PostFeed from "../../components/PostFeed/PostFeed";
import Header from "../../components/Header/Header";
import AddPostForm from "../../components/AddPostForm/AddPostForm";

import { Grid } from "semantic-ui-react";

import tokenService from '../../utils/tokenService';


export default function FeedPage({loggedUser, handleLogout}) {

  const [posts, setPosts] = useState([]); 
  const [loading, setLoading] = useState(true)

  async function handleAddPost(postToSendToServer){
	console.log(postToSendToServer, " formData from addPost form")

	try {
	
		const response = await fetch('/api/posts', {
			method: 'POST',
			body: postToSendToServer, 
			headers: {
					
					Authorization: "Bearer " + tokenService.getToken() 
					
				}
		})

		const data = await response.json();

		console.log(data, ' response from post request! This from express')
		setPosts([data.post, ...posts])
	} catch(err){
		console.log(err.message)
		console.log('CHECK YOUR SERVER TERMINAL!!!!')
	}

  }

  async function getPosts() {
    try {

	

      const response = await fetch("/api/posts", {
        method: "GET",
        headers: {
   
          Authorization: "Bearer " + tokenService.getToken(),
        
        },
      });

      const data = await response.json();
     
	  setLoading(false)
      console.log(data);
      setPosts(data.posts);
    } catch (err) {
      console.log(err);
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
      getPosts(); 
      
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
      getPosts(); 
      
    } catch(err){
      console.log(err)
    }
  }



  
  useEffect(() => {
   


    getPosts();
  }, []);
  return (
    <Grid centered>
      <Grid.Row>
        <Grid.Column>
        <Header loggedUser={loggedUser} handleLogout={handleLogout}/>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column style={{ maxWidth: 600 }}>
          <AddPostForm  handleAddPost={handleAddPost}/>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column style={{ maxWidth: 600 }}>
         {loading ? <h1>Loading.....</h1> : <PostFeed  posts={posts} itemsPerRow={1} isProfile={false} addLike={addLike} removeLike={removeLike} loggedUser={loggedUser}/> } 
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}
