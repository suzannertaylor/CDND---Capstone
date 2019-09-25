import * as uuid from 'uuid'

import { PostItem } from '../models/PostItem'
import { PostUpdate } from '../models/PostUpdate'
import { PostAccess } from '../dataLayer/postsAccess'
import { CreatePostRequest } from '../requests/CreatePostRequest'
import { UpdatePostRequest } from '../requests/UpdatePostRequest'
import { parseUserId } from '../auth/utils'

const postAccess = new PostAccess()

export async function createPost(
    createPostRequest: CreatePostRequest,
  jwtToken: string
): Promise<PostItem> {

  const itemId = uuid.v4()
  const userId = parseUserId(jwtToken)

  return await postAccess.createPost({
    postId: itemId,
    userId: userId,
    content: createPostRequest.content,
    createdAt: new Date().toISOString()
  })
}

export async function updatePost(
    postId: string,
    updatePostRequest: UpdatePostRequest
): Promise<PostUpdate> {

  return await postAccess.updatePost(
    postId,
    {
      content: updatePostRequest.content
    }
  )
}

export async function deletePost(
    postId: string
) {
  return await postAccess.deletePost(
    postId
  )
}

