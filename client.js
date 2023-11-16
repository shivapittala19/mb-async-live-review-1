const { json } = require("express")
const fetch = require("node-fetch")

async function fetchTodosForUsers(userIds){
  const todoPromises = userIds.map(async (userId) =>{
    const response = await fetch(`http://localhost:3000/todos?user_id=${userId}`)
    const data  = await response.json()
    return data.todos
  })
  
  const chunkTodos=await Promise.all(todoPromises);
  const todoData = chunkTodos.map((allData) =>{
    console.log(allData)
    const userId=allData[0].text.split(" ")[4]
    const noOfTodosCompleted=allData.filter((todo)=> todo.isCompleted).length;
    let userData={
      id:parseInt(userId),
      name:"User "+userId,
      numTodosCompleted:noOfTodosCompleted
    }
    return userData
  })
  return todoData
}


async function main() {

  const usersResponse = await fetch("http://localhost:3000/users");
  const userData = await usersResponse.json()
  const users = userData.users
  const allUsersInfo = []

  const chunkSize = 5
  for(let index=0; index<users.length; index +=chunkSize){
    const chunks = users.slice(index,index+chunkSize)
    const todoArrays = await fetchTodosForUsers(chunks.map(user => user.id))
    allUsersInfo.push(todoArrays)
    await new Promise(resolve => setTimeout(resolve,1000))
  }
  console.log(allUsersInfo)

}
main();

// write your code here

