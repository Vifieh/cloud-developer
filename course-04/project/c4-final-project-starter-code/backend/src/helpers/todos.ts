import * as todoAccess from './todosAcess'
// import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
// import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'
import {getUserId} from "../lambda/utils";

// TODO: Implement businessLogic
export function buildTodo(todoRequest: CreateTodoRequest, event): TodoItem {
    const todo = {
        todoId: uuid.v4(),
        createdAt: new Date().toISOString(),
        userId: getUserId(event),
        done: false,
        attachmentUrl: '',
        ...todoRequest
    }
    return todo as TodoItem
}

// get all todo
export async function getTodos(userId: string): Promise<TodoItem[]> {
    return todoAccess.getTodos( userId);
}
// delete to do
export async function deleteTodo(todoId: string, userId: string): Promise<any> {
    return await todoAccess.deleteTodo(todoId, userId);
}
