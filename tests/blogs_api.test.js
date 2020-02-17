const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')
const api = supertest(app)



beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})
describe('Database', () => {
    test('Blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('Right ammount of blogs', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body.length).toBe(helper.initialBlogs.length)
    })

    test('Blogs contain a spesific blog', async () => {
        const response = await api.get('/api/blogs')

        const title = response.body.map(r => r.title)

        expect(title).toContain(
            '... Frontend sekä backend'
        )
    })
})

describe('Controllers', () => {
    test('GET', async () => {
        const blogsAtEnd = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(blogsAtEnd.body.length).toBe(helper.initialBlogs.length)

    })
    test('GET_ID', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToView = blogsAtStart[0]

        const resultBlog = await api
            .get(`/api/blogs/${blogToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(resultBlog.body).toEqual(blogToView)
        expect(resultBlog.body.id).toBeDefined()
    })
    test('DELETE', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd.length).toBe(helper.initialBlogs.length - 1)

        const titles = blogsAtEnd.map(blog => blog.title)
        expect(titles).not.toContain(blogToDelete.title)
    })
    test('POST_blog', async () => {
        const newBlog = {
            title: '...Onnellinen oon.',
            author: 'Ilmari Kolehmainen',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 3,
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

        const title = blogsAtEnd.map(blog => blog.title)
        expect(title).toContain(
            '...Onnellinen oon.'
        )
    })
    test('POST_notblog', async () => {
        const badBlog = {
            likes: 182
        }
        await api
            .post('/api/blogs')
            .send(badBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
    })
    test('POST_nolikes', async () => {
        const blogNoLikes = {
            title: 'Työpaikan tähden ...',
            author: 'Ilmari Kolehmainen',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        }

        await api
            .post('/api/blogs')
            .send(blogNoLikes)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd[3].likes).toBe(0)
    })


})
afterAll(() => {
    mongoose.connection.close()
})