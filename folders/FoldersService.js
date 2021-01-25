const FoldersService = {
  getFolders(knex){
      return knex.select('*').from('noteful_folders')
  },
  getFolderById(knex, id){
      return knex.select('*').from('noteful_folders').where('id', id).first()
  },
  deleteFolder(knex, id){
      return knex('noteful_folders').where({id}).del()
  },
  addFolder(knex, newFolder){
      return knex.insert(newFolder).into('noteful_folders').returning('*').then(rows=> {
          return rows[0]
      })
  }
}

module.exports = FoldersService