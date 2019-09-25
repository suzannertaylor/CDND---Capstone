import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

const docClient = new XAWS.DynamoDB.DocumentClient()
const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

const postsTable = process.env.POSTS_TABLE
const imagesTable = process.env.IMAGES_TABLE
const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export const handler =  middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const postId = event.pathParameters.postId
  const imageId = uuid.v4()
  const validPostId = await postExists(postId)

  if (!validPostId) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Post does not exist'
      })
    }
  }

  const newItem = await createImage(postId, imageId, event)

  const url = getUploadUrl(imageId)

  return {
    statusCode: 200,
    body: JSON.stringify({
      item: newItem,
      uploadUrl: url
    })
  }
})

handler.use(
  cors({
    credentials: true
  })
)

async function postExists(postId: string) {
  const result = await docClient
    .get({
      TableName: postsTable,
      Key: {
        postId: postId
      }
    })
    .promise()

  console.log('Get post: ', result)
  return !!result.Item
}

async function createImage(postId: string, imageId: string, event: any) {
  const timestamp = new Date().toISOString()
  const newImage = JSON.parse(event.body)
  
  const newItem = {
    postId,
    timestamp,
    imageId,
    ...newImage,
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${imageId}`
  }
  console.log('Storing new item: ', newItem)

  await docClient
    .put({
      TableName: imagesTable,
      Item: newItem
    })
    .promise()

  return newItem
}

function getUploadUrl(imageId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: imageId,
    Expires: urlExpiration
  })
}