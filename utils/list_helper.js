const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  if(blogs.length === 0) {
    return 0
  }
  return blogs.map(blog => blog.likes).reduce((acc, curr) => acc + curr)
}

const favoriteBlog = (blogs) => {

  const favorite = Math.max.apply(Math, blogs.map(blog => { return blog.likes }))
  const index = blogs.findIndex(blog => blog.likes === favorite)
  console.log(blogs[index])
  return blogs[index]
}
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}