import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateTodo } from '../../helpers/todosAcess'
// import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
// import { getUserId } from '../utils'
import {TodoItem} from "../../models/TodoItem";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      // const todoId = event.pathParameters.todoId
      const updatedTodo: TodoItem = JSON.parse(event.body)
      // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
      // const userId = getUserId(event);
      await updateTodo(updatedTodo);
      return {
          statusCode: 204,
          headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true
          },
          body: ''
      };
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
        origin:'http://localhost:3000',
        credentials: true
    })
  )
