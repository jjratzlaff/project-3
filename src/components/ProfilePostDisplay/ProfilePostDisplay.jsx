import { Card } from 'semantic-ui-react'
import PostCard from '../PostCard/PostCard';


export default function ProfilePostDisplay({isProfile, posts, itemsPerRow}){

    const postCards = posts.map((post) => {
        return (<PostCard key={post._id} post={post} isProfile={isProfile}/>)
    })

    return (
      <Card.Group itemsPerRow={3}>
       {postCards}
       </Card.Group>
    
    )
}
