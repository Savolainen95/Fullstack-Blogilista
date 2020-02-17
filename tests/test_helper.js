const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: 'Fullstack tuo, Fullstack tuo...',
        author: 'Ilmari Kolehmainen',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5
    },
    {
        title: '... fullstack tuo duunin jokaisen luo...',
        author: 'Ilmari Kolehmainen',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 3,
    },
    {
        title: '... Frontend sekä backend',
        author: 'Ilmari Kolehmainen',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 3,
    }
]

const nonExistingId = async () => {
    const blog = new Blog({ author: 'willremovethissoon' })
    await note.save()
    await note.remove()

    return note._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs, nonExistingId, blogsInDb
}