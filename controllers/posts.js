const Post = require('../model/post');
const { handleSuccess, handleError } = require('../service/handler');

const posts = {
  async getPosts(req, res) {
    const posts = await Post.find();
    handleSuccess(res, posts);
  },
  async createPost({ body, res }) {
    try {
      const { name, content, type, image, ...field } = JSON.parse(body);
      if (!name || !content || !type || !image)
        return handleError(res, 400, 'Please fill in all required fields');
      const createPost = {
        name: name.trim(),
        content: content.trim(),
        type: type.trim(),
        image: image.trim(),
        ...field,
      };
      await Post.create(createPost);
      handleSuccess(res, createPost);
    } catch (err) {
      handleError(res, 400, err.message);
    }
  },
  async deleteAllPosts(req, res) {
    await Post.deleteMany();
    const posts = await Post.find();
    handleSuccess(res, posts);
  },
  async deletePost(req, res) {
    const id = req.url.split('/posts/').pop();
    if (!id) return handleError(res, 400, 'id is required');
    try {
      const post = await Post.findByIdAndDelete(id);
      if (!post) {
        handleError(res, 400, 'id not found');
        return;
      }
      handleSuccess(res, post);
    } catch (err) {
      handleError(res, 400, err.message);
    }
  },
  async editPost({ body, req, res }) {
    try {
      const data = JSON.parse(body);
      const id = req.url.split('/posts/').pop();
      if (!id) return handleError(res, 400, 'id is required');
      const updatePost = await Post.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });
      if (!updatePost) return handleError(res, 400, 'edit post failed');
      handleSuccess(res, updatePost);
    } catch (err) {
      handleError(res, 400, err.message);
    }
  },
};

module.exports = posts;
