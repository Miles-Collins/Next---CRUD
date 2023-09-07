import { NextResponse } from 'next/server'

const DATA_SOURCE_URL = "https://jsonplaceholder.typicode.com/todos"

const API_KEY: string = process.env.DATA_API_KEY as string

export async function GET() {
  const res = await fetch(DATA_SOURCE_URL) 

  const todos: Todo[] = await res.json()

  return NextResponse.json(todos)
}

export async function POST(request: Request) {
  const todo: Todo = await request.json()

  if(!todo.userId || !todo.title) {
    return NextResponse.json({"message": "Missing required data!"})
  }

  todo.completed = false

  const res = await fetch(DATA_SOURCE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'API-Key': API_KEY
    },
    body: JSON.stringify(todo)
  })

  const newTodo: Todo = await res.json()

  return NextResponse.json(newTodo)
}

export async function PUT(request: Request) {
  const {id, userId, title, completed}: Todo = await request.json()

  if(!id || !userId || !title || typeof completed !== 'boolean' ) {
    return NextResponse.json({"message": "Missing required data!"})
  }

  const res = await fetch(`${DATA_SOURCE_URL}/${id}`, {
    method: 'PUT', 
    headers: {
      'Content-Type': 'application/json',
      'API-Key': API_KEY
    },
    body: JSON.stringify({
      id, userId, title, completed
    })
  })

  const editedTodo: Todo = await res.json()

  return NextResponse.json(editedTodo)
}

export async function DELETE(request: Request) {
  const {id}: Partial<Todo> = await request.json()

  if(!id) {
    throw NextResponse.json({'message': "That todo does not exist, provide a proper Id!"})
  }

  await fetch(`${DATA_SOURCE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json',
      'API-Key': API_KEY
    }
  })

  return NextResponse.json({"message": "Successfully removed todo!"})
}