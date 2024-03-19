import { Card, Icon, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";



export default function PostCard({ post, isProfile, addLike, removeLike, loggedUser }) {

  // if the logged in User's is in the post.likes array 
  // loggedUser has Liked the post 
     // - heart color - red
     // - clickHandler - removeLike

  // loggedUser has not liked the post
     // - heart color - grey
     // - clickHandler - addLike

  // function handleAddLike(){
  //   addLike(post._id)
  // }
 
  // function handleRemoveLike(){
  //   removeLike(post.likes[likedIndex]._id) 
  // }


  // 1. Search the array for the user
  // this will return -1, if there is no match, otherwise it will return the index num of the like
  const likedIndex = post.likes.findIndex(like => like.username === loggedUser.username);
  const likeColor = likedIndex > -1 ? 'red' : 'grey';
  const clickHandler = likedIndex > -1 ? () => removeLike(post.likes[likedIndex]._id) : () => addLike(post._id)


  // This is the same as the arrow functions above, we don't want to call the functions until the button is clicked
  // the arrow functions are just anoymous functions (without a name)
  // const clickHandler = likedIndex > -1 ? handleRemoveLike : handleAddLike
  

  // Another Option using find 
  // const like = post.likes.find(like => like.username === loggedUser.username);
  // const likeColor = like ? 'red' : 'grey';
  // const clickHandler = like ? () => removeLike(like._id) : () => addLike(post._id)


  return (

    <Card>
      {isProfile ? null : (
        <Card.Content textAlign="left">
          <Link to={`/${post.user.username}`}>
            <Image
              floated="left"
              size="large"
              avatar
              src={
                post.user.photoUrl
                  ? post.user.photoUrl
                  : "https://react.semantic-ui.com/images/wireframe/square-image.png"
              }
            />
            <Card.Header floated="right">{post.user.username}</Card.Header>
          </Link>
        </Card.Content>
      )}

      <Image src={`${post.photoUrl}`} wrapped ui={false} />
      <Card.Content>
        <Card.Description>{post.caption}</Card.Description>
      </Card.Content>
      <Card.Content extra textAlign={"right"}>
        <Icon name={"heart"} size="large" color={likeColor} onClick={clickHandler}/>
        {post.likes.length} Likes
      </Card.Content>
    </Card>
  );
}
