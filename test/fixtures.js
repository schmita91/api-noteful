function makeFoldersArray(){
    return[
        {
            id:1,
        folder_name: 'super'
        },
        {
            id: 2,
        folder_name: 'spangley'
        },
        {
            id: 3,
        folder_name: 'important'
        }
    ]
}

function makeNotesArray(){
return [
    {
        id: 1,
      note_name: 'super important',
      modified: "2020-04-26T20:32:02.413Z",
      folderId: 1,
      content: 'lorem ipsum lorem ipsum lorem ipsum'
    },
    {
        id: 2,
      note_name: 'not very important',
      modified: "2020-04-26T20:32:02.413Z",
      folderId: 2,
      content: 'lorem ipsum lorem ipsum lorem ipsum'
    },
    {
        id: 3,
      note_name: 'important',
      modified: "2020-04-26T20:32:02.413Z",
      folderId: 3,
      content: 'lorem ipsum lorem ipsum lorem ipsum'
    }
  ]
}
const maliciousFolder = {
folder_name: `Bad <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">`
}
const cleanFolder = {
id: 1,
folder_name: `Bad <img src="https://url.to.file.which/does-not.exist">`
}
const maliciousNote = {
  id: 1,
note_name: 'important',
modified: "2020-04-26T20:32:02.413Z",
folderId: 3,
content: `Bad <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">`
}
const cleanNote = {
  id:1,
note_name: 'important',
modified: "2020-04-26T20:32:02.413Z",
folderId: 3,
content: `Bad <img src="https://url.to.file.which/does-not.exist">`
}
module.exports = {makeNotesArray, makeFoldersArray, maliciousFolder, cleanFolder, maliciousNote, cleanNote }