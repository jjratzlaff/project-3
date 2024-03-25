import { useState } from 'react'
import { Button, Form, Segment } from 'semantic-ui-react'


export default function AddPostForm({handleAddPost}){
    
    const [state, setState] = useState({
        caption: ''
    })

    const [photo, setPhoto] = useState({})

    function handleFileInput(e){
        setPhoto(e.target.files[0])
    }

    function handleChange(e){
        setState({
            ...state, 
            [e.target.name]: e.target.value
        })
    }

    function handleSubmit(e){
        e.preventDefault()
        const formData = new FormData()
        formData.append('caption', state.caption)
        formData.append('photo', photo)
        handleAddPost(formData)
    }

    return (
    <Segment>
        <Form autoComplete="off" onSubmit={handleSubmit}>
          <Form.Input
            className="form-control"
            name="caption"
            value={state.caption}
            placeholder="Write a Caption"
            onChange={handleChange}
            required
          />
          <Form.Input
            className="form-control"
            type="file"
            name="photo"
            placeholder="upload image"
            onChange={handleFileInput}
          />
          <Button type="submit" className="btn">
            SUBMIT POST
          </Button>
        </Form>
      </Segment>
 
    );
}