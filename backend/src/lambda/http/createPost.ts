import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreatePostRequest } from '../../requests/CreatePostRequest'
import { createPost } from '../../businessLogic/posts'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newPost: CreatePostRequest = JSON.parse(event.body)
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[(split.length - 1)]

  const newItem = await createPost(newPost, jwtToken)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newItem
    })
  }
}
