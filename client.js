const { json } = require("express")
const fetch = require("node-fetch")

async function fetchUserData(){
  const usersResponse  = await fetch("http://localhost:3000/users")
  const userData = await usersResponse.json()
  return userData.users
}

async function fetchTodosForUsers(userIds){
  const eachUserPromises = userIds.map(async (userId) =>{
    const response = await fetch(`http://localhost:3000/todos?user_id=${userId}`)
    const data  = await response.json()
    return data.todos
  })
  
  const todosData=await Promise.all(eachUserPromises);
  
  const todoDataUser = todosData.map((allData) =>{
    console.log(allData)
    const userId=allData[0].text.split(" ")[4]
    const noOfTodosCompleted=allData.filter((todo)=> todo.isCompleted).length;
    let userData={
      id:parseInt(userId),
      name:"User "+userId,
      noOfTodosCompleted:noOfTodosCompleted
    }
    return userData
  })
  return todoDataUser
}


async function main() {

  const userData = await fetchUserData()
  console.log(userData)

  const allUsersInfo = []

  const chunkSize = 5
  for(let index=0; index<userData.length; index +=chunkSize){
    const chunks = userData.slice(index,index+chunkSize)
    const todoArrays = await fetchTodosForUsers(chunks.map(user => user.id))
    allUsersInfo.push(todoArrays)
    await new Promise(resolve => setTimeout(resolve,1000))
  }
  console.log(allUsersInfo)
 

}
main();

// write your code here

