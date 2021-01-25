const NotesService = {
  getNotes(knex){
      return knex.select('*').from('noteful_notes')
  },
  getById(knex, id){
      return knex.select('*').from('noteful_notes').where('id', id).first()
  },
  deleteNote(knex, id){
      return knex('noteful_notes').where({id}).del()
  },
  addNote(knex, note){
      return knex.insert(note).into('noteful_notes').returning('*').then(rows=> {
          return rows[0]})
  },
  updateNote(knex, id, content){
      return knex('noteful_notes').where({id}).update(content)
  }
}
module.exports = NotesService