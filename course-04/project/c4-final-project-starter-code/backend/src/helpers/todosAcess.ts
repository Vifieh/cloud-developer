import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
// import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
// import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)
const todosTable = process.env.TODOS_TABLE
const index = process.env.TODOS_CREATED_AT_INDEX
const docClient: DocumentClient = createDynamoDBClient()
// const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
//create todo
export async function createTodo(todo: TodoItem): Promise<TodoItem> {
    await docClient.put({
        TableName: todosTable,
        Item: todo
    }).promise()

    return todo
}
// get all todo
export async function getTodos(userId:String ): Promise<TodoItem[]> {
    console.log('Getting all todos')
    const updateExpression = '#userId = :userId';
    const result = await docClient.query({
        TableName: todosTable,
        KeyConditionExpression: updateExpression,
        ExpressionAttributeNames: {
            '#userId':'userId'
        },
        ExpressionAttributeValues: {
            ":userId": userId,
        },
    }).promise()
    const items = result.Items
    return items as TodoItem[]
}
// update todo
export async function updateTodo(updatetodo: TodoItem): Promise<TodoItem> {
    const result = await docClient.update({
        TableName: todosTable,
        Key: {
            userId: updatetodo.userId,
            todoId: updatetodo.todoId
        },
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
            ':attachmentUrl': updatetodo.attachmentUrl
        }
    }).promise();

    return result.Attributes as TodoItem;
}

// delete todo
export async function deleteTodo(todoId: string, userId: string): Promise<any> {
    await docClient.delete({
        TableName: todosTable,
        Key: {
            "userId": userId,
            "todoId": todoId
        }
    }, function(err) {
        if (err) console.log('Error occured on deleting an item to db',{error: err, item: {userId, todoId}});                                   // an error occurred
        else     console.log('Data has been successfully deleted from db', {item: {
                "userId": userId,
                "todoId": todoId
            }});
    }).promise();
}



// get  todo
export async function getTodoById(todoId:String ): Promise<TodoItem> {
    const result = await docClient.query({
        TableName: todosTable,
        IndexName: index,
        KeyConditionExpression: 'todoId = :todoId',
        ExpressionAttributeValues: {
            ":todoId": todoId
        },
    }).promise()
    const items = result.Items
    if(items.length!=0){
        return result.Items[0] as TodoItem
    }
    return null
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
