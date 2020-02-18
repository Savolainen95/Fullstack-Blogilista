const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0
  }
  return blogs.map(blog => blog.likes).reduce((acc, curr) => acc + curr)
}

const favoriteBlog = (blogs) => {

  const favorite = Math.max.apply(Math, blogs.map(blog => { return blog.likes }))
  const index = blogs.findIndex(blog => blog.likes === favorite)
  return blogs[index]
}

const mostBlogs = (blogs) => {
  const authors = blogs.map(blog => blog.author)

  const count = {}
  authors.forEach(function (i) { count[i] = (count[i] || 0) + 1 })

  const apuri = Object.entries(count).sort((a, b) => b[1] - a[1])
  const most = {
    author: apuri[0][0],
    blogs: apuri[0][1]
  }
  return most
}

const mostLikes = (blogs) => {
  var _ = require('lodash'); 
  const valmis = []
  const grouped = _.groupBy(blogs, 'author')
 _.forEach(grouped, author =>  {
    var redy = {
      author: author[0].author,
      likes: _.sumBy(author, 'likes')
    }
    valmis.push(redy)
  })
  valmis.sort((a,b) => b.likes - a.likes)
  return valmis[0]
}

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}