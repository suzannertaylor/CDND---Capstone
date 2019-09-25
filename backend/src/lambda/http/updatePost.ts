import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdatePostRequest } from '../../requests/UpdatePostRequest'
import { updatePost } from '../../businessLogic/posts'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const postId = event.pathParameters.postId
  const updatedPost: UpdatePostRequest = JSON.parse(event.body)

  const updatedItem = await updatePost(postId, updatedPost)

  console.log("UpdateItem succeeded:", JSON.stringify(updatedItem, null, 2))
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      updatedItem
    })
  }
}
