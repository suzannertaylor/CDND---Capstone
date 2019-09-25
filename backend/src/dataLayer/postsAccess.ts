import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import { PostItem } from '../models/PostItem'
import { PostUpdate } from '../models/PostUpdate'

export class PostAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly postsTable = process.env.POSTS_TABLE) {
  }
  
  async createPost(post: PostItem): Promise<PostItem> {
    await this.docClient.put({
      TableName: this.postsTable,
      Item: post
    }).promise()

    return post
  }

  async updatePost(
    postId: string,
    postUpdate: PostUpdate
  ): Promise<PostUpdate> {
    var params = {
      TableName: this.postsTable,
      Key:{
          "postId": postId
      },
      UpdateExpression: "set info.name=:name, info.dueDate=:dueDate, info.done=:done",
      ExpressionAttributeValues:{
        "content": postUpdate.content
      },
      ReturnValues:"UPDATED_NEW"
    }
    
    console.log("Updating the item...");

    await this.docClient.update(params)

    return postUpdate
  }

  async deletePost(
    postId: string) {

    var params = {
      TableName: this.postsTable,
      Key:{
          "postId": postId
      }
    };

    console.log("Attempting a delete...");
    await this.docClient.delete(params).promise()
    return
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
