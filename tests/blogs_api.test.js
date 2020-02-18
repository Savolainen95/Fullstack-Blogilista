const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const api = supertest(app)




describe('Database', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)

        await User.deleteMany({})
        await User.insertMany(helper.initialUsers)
        
    })
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
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)

        //Authorization ongelma. mitenköhä vitussa se korjataan.

        await User.deleteMany({})
        await User.insertMany(helper.initialUsers)
    })
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
        const newUser =  {
            username: "Savukka",
            name: "Mikko Savolainen",
            password: "fäcä"
        }
        const userLogin =  {
            username: "Savukka",
            password: "fäcä"
        }
        

        await api.post('/api/users').send(newUser).expect(200).expect('Content-Type', /application\/json/)
        const login =  await api.post('/api/login').send(userLogin).expect(200).expect('Content-Type', /application\/json/)
        const token = login.body.token

        const blog = {
            title: 'Työpaikan tähden ...',
            author: 'Ilmari Kolehmainen',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 4
        }

        const blog1 = await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${token}`)
            .send(blog)
            .expect(200)

        const index = blog1.body.id
        const title = blog1.body.title

        await api
            .delete(`/api/blogs/${index}`)
            .set('Authorization', `bearer ${token}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)

        const titles = blogsAtEnd.map(blog => blog.title)
        expect(titles).not.toContain(title)
    })
    test('POST_blog', async () => {

        const newUser =  {
            username: "Savukka",
            name: "Mikko Savolainen",
            password: "fäcä"
        }
        const userLogin =  {
            username: "Savukka",
            password: "fäcä"
        }
        

        await api.post('/api/users').send(newUser).expect(200).expect('Content-Type', /application\/json/)
        const login =  await api.post('/api/login').send(userLogin).expect(200).expect('Content-Type', /application\/json/)
        const token = login.body.token

        const newBlog = {
            title: '...Onnellinen oon.',
            author: 'Ilmari Kolehmainen',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 3,
        }
        
        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${token}`)
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
        const newUser =  {
            username: "Savukka",
            name: "Mikko Savolainen",
            password: "fäcä"
        }
        const userLogin =  {
            username: "Savukka",
            password: "fäcä"
        }
        

        await api.post('/api/users').send(newUser).expect(200).expect('Content-Type', /application\/json/)
        const login =  await api.post('/api/login').send(userLogin).expect(200).expect('Content-Type', /application\/json/)
        const token = login.body.token

        const badBlog = {
            likes: 182
        }
        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${token}`)
            .send(badBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
    })
    test('POST_nolikes', async () => {

        const newUser =  {
            username: "Savukka",
            name: "Mikko Savolainen",
            password: "fäcä"
        }
        const userLogin =  {
            username: "Savukka",
            password: "fäcä"
        }

        await api.post('/api/users').send(newUser).expect(200).expect('Content-Type', /application\/json/)
        const login =  await api.post('/api/login').send(userLogin).expect(200).expect('Content-Type', /application\/json/)
        const token = login.body.token

        const blogNoLikes = {
            title: 'Työpaikan tähden ...',
            author: 'Ilmari Kolehmainen',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${token}`)
            .send(blogNoLikes)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd[3].likes).toBe(0)
    })
})
describe('when there is initially one user at db', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        await User.insertMany(new User({ username: 'root', password: 'sekret' }))
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })
    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('`username` to be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd.length).toBe(usersAtStart.length)
    })

})
afterAll(() => {
    mongoose.connection.close()
})