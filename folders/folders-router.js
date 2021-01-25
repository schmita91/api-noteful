const express = require('express')
const FoldersService = require('./FoldersService')
const foldersRouter = express.Router()
const jsonParser = express.json()
const xss = require('xss')

const serializeFolder = (folder) => ({
    id: folder.id,
    folder_name: xss(folder.folder_name)
})

foldersRouter
.route('/')
.get((req, res, next) =>{
    FoldersService.getFolders(req.app.get('db'))
    .then(folders =>{
        res.status(200)
        .json(folders.map(serializeFolder))
    })
    .catch(next)
})
.post(jsonParser, (req, res, next)=>{
    const {folder_name} = req.body
    const newFolder = { folder_name }
    
    const folder_value = Object.values(newFolder).filter(Boolean).length
    if (folder_value === 0){
        return res.status(404).json({error: {message: 'please provide a folder name'}})
    }
    FoldersService.addFolder(req.app.get('db'), newFolder)
    .then(folder=>{
        res.status(201)
        .location(`/api/folders/${folder.id}`)
        .json(serializeFolder(folder))
    })
    .catch(next)
})

foldersRouter
.route('/:id')
.all((req, res, next)=>{
    FoldersService.getFolderById(req.app.get('db'), req.params.id)
    .then(folder =>{
        if (!folder){
            return res.status(404).json({error: {message: 'Folder not found'}}
        )}
        res.folder = folder
        next()
    })
    .catch(next)
})
.get((req, res, next) => {
        res.json(res.folder)
    })
.delete((req, res, next) => {
    const folderId = req.params.id
    FoldersService.deleteFolder(req.app.get('db'), folderId)
    .then(folder=>{
        res.status(204).send(`folder with id ${folderId} successfully deleted`)
        .end()
    })
})

module.exports = foldersRouter