import {conversationData} from './data/conversationData.js'
const data = conversationData

const chatsList = document.querySelector('.chatsList')
const userPhotoWrapper = document.querySelector('.userDetails__userPhoto')
const selectStatusElement = document.querySelector('#changeStatus')
const searchPeopleInput = document.querySelector('#search-people')

const chatWrapper = document.querySelector('.chat__wrapper')
const form = document.querySelector('#form')

const typeFileInputs = document.getElementsByName('files-type')
const allFiles = document.querySelector('.files--all')
const imagesFiles = document.querySelector('.files--images')
const filesList = document.querySelector('.files__list')

const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

let currentConversationIndex = 0

const renderConversation = (conversations,photo) => {
    chatWrapper.innerHTML = ''
    conversations.forEach((conversation) => {
        const dateURL = conversation.postDate
        const chatURL = conversation.chat

        const newMessage = document.createElement('div')
        newMessage.classList.add('startNewMessage')

        const messageDate = document.createElement('p')
        messageDate.classList.add('startNewMessage__chatData')
        messageDate.innerText = `${dateURL.day} ${monthNames[dateURL.month]} ${dateURL.year}, ${dateURL.time}`
        
        const chatContainer = document.createElement('div')
        chatContainer.classList.add('startNewMessage__chatContainer')        
        
        chatURL.forEach((message,index) => {
            const messageSender = message.sender
            let nextSender
            
            (index + 1 === chatURL.length)? nextSender = "user" : nextSender = chatURL[index + 1].sender
            
            const messageContainer = document.createElement('div')
            const userPhotoContainer = document.createElement('div')
            userPhotoContainer.classList.add('img-container','messageContainer__photoContainer')
        
            if(messageSender === "friend"){
                messageContainer.classList.add('messageContainer', 'messageContainer--friend')
                if(messageSender !== nextSender){
                    const img = document.createElement('img')
                    img.src = photo
                    userPhotoContainer.appendChild(img)
                }
            }else{
                messageContainer.classList.add('messageContainer', 'messageContainer--user')
            }
            
            const messageContent = document.createElement('p')
            messageContent.classList.add('messageContainer__content')
            messageContent.innerText = message.message

            messageContainer.append(userPhotoContainer,messageContent)
            chatContainer.appendChild(messageContainer)
        })
        newMessage.append(messageDate,chatContainer)
        chatWrapper.appendChild(newMessage)
        chatWrapper.scrollTop = chatWrapper.scrollHeight
    })
}

const openConversation = ({chatName, userPhoto, userMessages, files}) => {
    const chatUserName = document.querySelectorAll('.chat__userName')
    const profilePhoto = document.querySelector('.userDetails__photo')
    const allFiles = document.querySelector('#all-files-count')
    const imagesFiles = document.querySelector('#images-files-count')
    const imagesFile = document.querySelector('.file__data--filesImages')

    filesList.innerHTML = ''
    chatUserName.forEach(name => name.innerText = chatName)
    profilePhoto.src = userPhoto
    
    let filesCount = 0

    files.forEach(fileData => {
        filesCount += fileData.count

        const file = document.createElement('li')
        file.classList.add('file')
        const icon = document.createElement('div')
        icon.classList.add('file__icon',`file__icon--${fileData.title}`)
        icon.innerHTML = fileData.icon

        const container = document.createElement('div')
        const title = document.createElement('h4')
        fileData.title === "pdf" ? title.classList.add('file__title',`file__title--${fileData.title}`) : title.classList.add('file__title')
        title.innerText = fileData.title

        const data = document.createElement('p')
        data.classList.add('file__data')
        data.innerHTML = `${fileData.count} Files, ${fileData.size}`

        container.append(title,data)

        const moreBtn = document.createElement('button')
        moreBtn.classList.add('file__more-btn')
        moreBtn.innerHTML = '<i class="fa-solid fa-angle-right"></i>'

        file.append(icon,container,moreBtn)
        filesList.appendChild(file)
    })

    imagesFile.innerText = `${files[0].count} Files, ${files[0].size}`
    
    allFiles.innerText = filesCount
    imagesFiles.innerText = files[0].count
    renderConversation(userMessages,userPhoto)
}

const renderFriendList = (data) => {
    const chatListData = data.map(person => (
        {
            name: person.chatName, 
            photo: person.userPhoto, 
            status: person.active,
            lastMessage: person.userMessages[person.userMessages.length - 1].chat[person.userMessages[person.userMessages.length - 1].chat.length -1].message,
            lastMessageStatus: person.userMessages[person.userMessages.length - 1].chat[person.userMessages[person.userMessages.length - 1].chat.length -1].unread,
            time: person.userMessages[person.userMessages.length - 1].postDate.time
        }
    ))

    chatsList.innerHTML = ''
    chatListData.forEach((chat,index) => {
        const chatIteam = document.createElement('li')
        chatIteam.addEventListener('click', () => {
            currentConversationIndex = index
            data.forEach(chat => chat.active = false)
            data[index].active = true
            data[index].userMessages[data[index].userMessages.length - 1].chat[data[index].userMessages[data[index].userMessages.length - 1].chat.length -1].unread = false
            renderFriendList(data)
            openConversation(data[index])
        })

        chat.status ? chatIteam.classList.add('chatsList__iteam','chatsList__iteam--active') : chatIteam.classList.add('chatsList__iteam')

        const chatUserPhoto = document.createElement('div')
        chatUserPhoto.classList.add('chatsList__iteam--userPhoto','img-container')
        const photo = document.createElement('img')

        fetch(chat.photo)
            .then(response => response.blob()).then(blob => {photo.src = URL.createObjectURL(blob)}).catch(err => console.err(err))

        const chatContent = document.createElement('div')
        chatContent.classList.add('chatsList__iteam--content')    
        const userName = document.createElement('p')
        userName.classList.add('userName')
        userName.innerText = chat.name
        const message = document.createElement('p')
        chat.lastMessageStatus ? message.classList.add('chatsList__iteam--message') : message.classList.remove('chatsList__iteam--message')
        message.innerText = chat.lastMessage

        const chatTime = document.createElement('p')
        chatTime.classList.add('chatsList__iteam--time')
        chatTime.innerText = chat.time

        chatContent.append(userName,message)
        chatUserPhoto.appendChild(photo)
        chatIteam.append(chatUserPhoto,chatContent,chatTime)
        chatsList.appendChild(chatIteam)
    })
}

const search = () =>{
    const query = searchPeopleInput.value.toLowerCase()
    const filterChats = data.filter(chat => chat.chatName.toLowerCase().includes(query))
    renderFriendList(filterChats);
}

const handleToggleStatus = () => {
    const status = selectStatusElement.value
    status === 'online' ? userPhotoWrapper.classList.add('online') : userPhotoWrapper.classList.remove('online')
}

renderFriendList(data)
openConversation(data[currentConversationIndex])
searchPeopleInput.addEventListener('input', search)
selectStatusElement.addEventListener('change', handleToggleStatus)
typeFileInputs.forEach(input => {
    input.addEventListener('change', () => {
        if(input.checked && input.value === "all-types"){
            allFiles.style.display = "block"
            imagesFiles.style.display = "none"
        }else{
            allFiles.style.display = "none"
            imagesFiles.style.display = "block"
        }
    })
})

form.addEventListener('submit', (e) => {
    e.preventDefault()

    const conversation = data[currentConversationIndex].userMessages
    const newMessageContent = document.querySelector('#newMessage').value

    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    let day = currentDate.getDate()
    day < 10 ? day = `0${day}` : null
    let hours = currentDate.getHours()
    hours < 10 ? hours = `0${hours}` : null
    let minutes = currentDate.getMinutes()
    minutes < 10 ? minutes = `0${minutes}` : null
    const time = `${hours}:${minutes}`

    const lastConversationIndex = conversation.length - 1
    const dateURL = conversation[lastConversationIndex].postDate

    const lastMessageDate = new Date(`${dateURL.year}-${dateURL.month+1}-${dateURL.day}T${dateURL.time}`)
    const timeDifference = Math.abs(currentDate.getTime() - lastMessageDate.getTime()) / (1000 * 60);

    console.log("Mineło:" + timeDifference + "minut");

    if(timeDifference < 20){
        const newMessage = {
            "sender": "user",
            "message": newMessageContent   
        }
        conversation[lastConversationIndex].chat.push(newMessage)
    }else{
        const newMessage = {
            "postDate": {
                "year": year,
                "month": month,
                "day": day,
                "time": time
            },
            "chat": [
                {
                    "sender": "user",
                    "message": newMessageContent 
                }
            ]
        }
        conversation.push(newMessage)
    }

    document.querySelector('#newMessage').value = ''
    data.splice(0,0, data.splice(currentConversationIndex, 1)[0])
    currentConversationIndex = 0
    renderConversation(conversation,data[currentConversationIndex].userPhoto)
    renderFriendList(data)
})