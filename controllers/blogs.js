const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.get('/:id', async (request, response, next) => {

  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog.toJSON())
  } else {
    response.status(404).end()
  }


})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0:body.likes
  })

  const savedBlog = await blog.save()
  response.json(savedBlog.toJSON())

})

blogsRouter.delete('/:id', async (request, response, next) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const blog1 = await Blog.findById(request.params.id)

  const blog = {
    title: body.title || blog1.title,
    author: body.author || blog1.author,
    url: body.url || blog1.url,
    likes: body.likes === undefined ? 0:body.likes
  }

  const updated = await Blog.findByIdAndUpdate(
    request.params.id,
    blog,
    { new: true }
  )
  response.json(updated.toJSON())

})

module.exports = blogsRouter