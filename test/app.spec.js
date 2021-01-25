const app = require('../src/app')
const {expect} = require('chai')
const knex = require('knex')
const {makeFoldersArray, 
      makeNotesArray, 
      maliciousFolder, 
      cleanFolder, 
      maliciousNote, 
      cleanNote} = require('./fixtures')




//FOLDERS ENPOINTS
describe('Noteful endpoints', () => {
  //make connection
        let db
  before('make knex instance',() => {
      db = knex({
        client: 'pg',
        connection: process.env.TEST_DATABASE_URL,
      })
      app.set('db', db)
   })
      // destroy connection after request
  after('disconnect from db',()=> db.destroy())
      // clean tables before and after
  before('clean the table', () => db.raw('TRUNCATE noteful_folders, noteful_notes RESTART IDENTITY CASCADE'))
  afterEach('cleanup',() => db.raw('TRUNCATE noteful_folders, noteful_notes RESTART IDENTITY CASCADE'))

// GET FOLDERS
     describe('GET folders endpoints', ()=>{

      context('GET requests given there is not data', ()=>{
        it('GET / responds with 200 and [] given no folders', () => {
          return supertest(app)
            .get('/api/folders')
            .expect(200,[])
        })
        it('GET /api/folders/:id given the folder does not exist, return 404 not found',()=>{
          const folderId = 12345
          return supertest(app)
          .get(`/api/folders/${folderId}`)
          .expect(404)
          .then(res=>{
            expect(res.body.error.message).to.equal('Folder not found')
          })
        })
      })
    
      context('GET requests given there is data',()=>{
        const testFolders = makeFoldersArray()
        const expected = {
    
        }
        beforeEach('insert test folders', () => {
          return db.into('noteful_folders').insert(testFolders)
         })
         it('GET / responds with 200 and expected folder given an array of folders',()=>{
           return supertest(app)
           .get('/api/folders')
           .expect(200, testFolders)
         })
         it('GET api/folder/:id returns specified folder',()=>{
           const folderId = 2;
           const expectedFolder = testFolders[1]
           return supertest(app)
           .get(`/api/folders/${folderId}`)
           .expect(200, expectedFolder)
         }) 
      })
   })
  // POST ARTICLES
   describe('POST article endpoints', ()=>{
     
    context('POST requests',()=>{
      it('POST /api/folders/ adds new folder as expected',()=>{
        const newFolder = {
          folder_name: 'Reminders'
        }
        return supertest(app)
        .post('/api/folders/')
        .send(newFolder)
        .expect(201)
        .then(res=> {
          expect(res.body.folder_name).to.equal('Reminders')
          expect(res.body.id).to.equal(1)
        })
      })
      it('POST will return 400 response if values are missing', ()=>{
        const faultyFolder = {
          folder_name: null
        }
        return supertest(app)
        .post('/api/folders/')
        .send(faultyFolder)
        .expect(404)
      })
    })
   })

   // DELETE FOLDERS
   describe('DELETE FOLDER endpoints', ()=>{
    context('DELETE requests', ()=>{
      const testFolders = makeFoldersArray()
      const foldersAfterDelete = [
        {
          id: 1,
          folder_name: 'super'
        },
        {
          id: 3,
          folder_name: 'important'
        }
      ]
      beforeEach('insert test folders', () => {
        return db.into('noteful_folders').insert(testFolders)
       })
      it('DELETE request successfully deletes a folder', ()=>{
        const folderId = 2
        return supertest(app)
        .delete(`/api/folders/${folderId}`)
        .expect(204)
        .then(res=>{
          return supertest(app)
          .get('/api/folders')
          .expect(200)
          .then(res=>{
            expect(res.body).to.eql(foldersAfterDelete)
          })
        })
      })
      it('DELETE request for folder that does not exist returns 404 ', ()=>{
        const folderId = 12345
        return supertest(app)
        .delete(`/api/folder/${folderId}`)
        .expect(404)
      })
    })
   })
// XSS TEST FOR FOLDERS
    describe('malicious folder', ()=>{
      context('given a malicious folder name', ()=>{
        before('insert malicious folder', ()=>{
        return db.into('noteful_folders').insert(maliciousFolder)
        })
        it('removes malicious folder content', ()=>{
          return supertest(app)
          .get('/api/folders')
          .expect(200, [cleanFolder])
        })
      })
    })
// GET NOTES
  describe('GET NOTES endpoints', ()=>{

    context('GET /api/notes/ request given no data', ()=>{
      it('GET /api/notes/ returns 200 and empty array', ()=>{
        return supertest(app)
        .get('/api/notes')
        .expect(200, [])
      })
      it('GET /api/notes/:id returns 404 response note not found', ()=>{
        const noteId= 12345
        return supertest(app)
        .get(`/api/notes/${noteId}`)
        .expect(404)
      })
    })
    context('GET request given there is data', ()=>{
      const testFolders = makeFoldersArray()
      const testNotes = makeNotesArray()
      beforeEach('insert test notes', ()=> {
        return db.into('noteful_folders').insert(testFolders)
        .then(()=>{
          return db.into('noteful_notes').insert(testNotes)
        })
      })
      it('GET returns an array of notes', ()=>{
        return supertest(app)
        .get('/api/notes/')
        .expect(200)
        .then(res=>{
          expect(res.body).to.be.an('array')
          expect(res.body).to.have.lengthOf(3)
        })
      })
      it('GET /api/notes/:id returns note with specified id', ()=>{
        const noteId = 2
        const expectedNote = testNotes[1]
        return supertest(app)
        .get(`/api/notes/${noteId}`)
        .expect(200)
        .then(res =>{
          expect(res.body.id).to.equal(noteId)
          expect(res.body.note_name).to.equal('not very important')
        })
      })
    })
    context('GET /api/notes/ returns sanitized note via xss', ()=>{
        const testFolders = makeFoldersArray()
        before('insert test notes', ()=> {
          return db.into('noteful_folders').insert(testFolders)
          .then(()=>{
            return db.into('noteful_notes').insert(maliciousNote)
          })
        })
      it('when a malicious note is in database, GET /api/notes/:id returns clean note', ()=>{
        const noteId = 1
        return supertest(app)
        .get(`/api/notes/${noteId}`)
        .expect(200)
        .then(res =>{
          expect(res.body.content).to.equal(cleanNote.content)
        })
      })
    })
  })
  //POST NOTES
    describe('POST NOTES endpoints', ()=>{
      const testFolders = makeFoldersArray()
      const testNotes = makeNotesArray()
      beforeEach('insert test notes', ()=> {
        return db.into('noteful_folders').insert(testFolders)
      })
    context('POST /api/notes/', ()=>{
      it('given all the required data, returns 201 status', () => {
        const newNote = {
          id: 4,
          note_name: 'note',
          folderId: 2,
          content:'helllooooo'
        }
        return supertest(app)
        .post('/api/notes')
        .send(newNote)
        .expect(201)
      })
      it('given invalid data, returns 400 status', ()=>{
        const newNote= {
          note_name: 'hello'
        }
        return supertest(app)
        .post('/api/notes')
        .send(newNote)
        .expect(400)
      })
    })
  })
  describe('PATCH NOTES endpoints', ()=>{
    const testFolders = makeFoldersArray()
      const testNotes = makeNotesArray()
      beforeEach('insert test notes', ()=> {
        return db.into('noteful_folders').insert(testFolders)
        .then(res => {
          return db.into('noteful_notes').insert(testNotes)
        })
      })
      context('PATCH /api/notes/:id ', ()=>{
        it('returns 204 response when the note meets requirements', ()=>{
          const updatedNote = {
            note_name: 'note',
            folderId: 2
          }
          const noteId = 2
          return supertest(app)
          .patch(`/api/notes/${noteId}`)
          .send(updatedNote)
          .expect(204)
        })
      })
  })
  describe('DELETE NOTE endpoints',()=>{
    const testFolders = makeFoldersArray()
      const testNotes = makeNotesArray()
      beforeEach('insert test notes', ()=> {
        return db.into('noteful_folders').insert(testFolders)
        .then(res => {
          return db.into('noteful_notes').insert(testNotes)
        })
      })
    context('given the note does not exist',()=>{
      it('returns 404 status', ()=>{
        const noteId= 12345
      return supertest(app)
      .delete(`/api/notes/${noteId}`)
      .expect(404)
      })
    })
    context('given the note does exist, expect 204 status', ()=>{
      it('returns 204 status on successful deletion of note', ()=>{
        const noteId = 2
        const expectedArray = testNotes.filter(note=> note.id !== noteId)
      return supertest(app)
      .delete(`/api/notes/${noteId}`)
      .expect(204)
      .then(()=>{
        return supertest(app)
        .get('/api/notes')
        .expect(200)
        .then(res =>{
          expect(res.body).to.have.lengthOf(2)
        })
      })
      })
    })
  })
})