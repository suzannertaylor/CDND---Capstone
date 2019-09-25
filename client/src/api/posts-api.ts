import { apiEndpoint } from '../config'
import { Post } from '../types/Post';
import { CreatePostRequest } from '../types/CreatePostRequest';
import Axios from 'axios'
import { UpdatePostRequest } from '../types/UpdatePostRequest';

export async function getPosts(idToken: string): Promise<Post[]> {
  console.log('Fetching posts')

  const response = await Axios.get(`${apiEndpoint}/posts`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Posts:', response.data)
  return response.data.items
}

export async function createPost(
  idToken: string,
  newPost: CreatePostRequest
): Promise<Post> {
  const response = await Axios.post(`${apiEndpoint}/posts`,  JSON.stringify(newPost), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchPost(
  idToken: string,
  postId: string,
  updatedPost: UpdatePostRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/posts/${postId}`, JSON.stringify(updatedPost), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deletePost(
  idToken: string,
  postId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/posts/${postId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  postId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/posts/${postId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
