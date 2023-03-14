import connection from "../connection.js";

export const getPosts = (req, res) => {
    const { limit, offset } = req.query;
    try {
        const query = limit ? "select * from posts order by created_at desc limit ? offset ?" : "select * from posts order by created_at desc";
        connection.query(query, [limit, offset], (error, results) => {
            if (error) return res.status(500).json({ error: error });
            if (results.length > 0) {
                const postCount = results.length;
                return res.status(200).json({ message: "success", data: results, total: postCount });
            } else {
                return res.status(404).json({ message: "No Data Found", data: [] });
            }
        })
    } catch (error) {
        return res.status(500).json({ error: error });
    }
}

export const getPost = (req, res) => {
    const { id } = req.params;
    try {
        const query = "select * from posts where id = ?";
        connection.query(query, [id], (error, results) => {
            if (error) return res.status(500).json({ error: error });
            if (results.length > 0) return res.status(200).json({ message: "success", data: results[0] })
            return res.status(404).json({ message: "No Data Found", data: [] })
        })
    } catch (error) {
        return res.status(500).json({ error: error });
    }
}

export const getPostBySearch = (req, res) => {
    const { search, author } = req.query;
    try {
        const query = "select * from posts where name like ? or author = ?";
        connection.query(query, ['%' + search + '%', author], (error, results) => {
            if (error) return res.status(500).json({ error: error });
            if (results.length > 0) return res.status(200).json({ message: "success", data: results });
            return res.status(404).json({ message: "No Data Found", data: [] })
        })
    } catch (error) {
        return res.status(500).json({ error: error });
    }
}

export const createPost = (req, res) => {
    const { name, description } = req.body;
    try {
        const userId = req.userId;
        if (!userId) return res.sendStatus(401);
        const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const query = "insert into posts (name, description, author, created_at) values (?, ?, ?, ?)";
        connection.query(query, [name, description, userId, createdAt], (error, results) => {
            if (error) return res.status(500).json(error);
            if (results.insertId) return res.status(201).json({ message: "Success", id: results.insertId });
        })
    } catch (error) {
        return res.status(500).json(error)
    }
}

export const updatePost = (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const query = "select * from posts where id = ?";
        connection.query(query, [id], (error, results) => {
            if (error) return res.status(500).json(error);
            if (results.length > 0) {
                const query = "update posts set ? where id = ?";
                connection.query(query, [{ name: name, description: description }, id], (error, results) => {
                    if (error) return res.status(500).json(error);
                    if (results.affectedRows > 0) return res.status(200).json({ message: "Success" });
                    return res.status(400).json({ message: "Please Try again" })
                })
            } else {
                return res.status(404).json({ message: "No Data Found" })
            }
        })
    } catch (error) {
        return res.status(500).json(error)
    }

}

export const deletePost = (req, res) => {
    const { id } = req.params;
    try {
        const query = "select * from posts where id = ?";
        connection.query(query, [id], (error, results) => {
            if (error) return res.status(500).json(error);
            if (results.length > 0) {
                const query = "delete from posts where id = ?";
                connection.query(query, [id], (error, results) => {
                    if (error) return res.status(500).json(error);
                    if (results.affectedRows > 0) return res.status(200).json({ message: "Success" });
                    return res.status(400).json({ message: "Please Try again" })
                })
            } else {
                return res.status(404).json({ message: "No Data Found" })
            }
        })
    } catch (error) {
        return res.status(500).json(error)
    }
}

export const commentPost = (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;
    const userId = req.userId;
    if (!userId) return res.sendStatus(401);
    try {
        const query = "select * from posts where id = ?";
        connection.query(query, [id], (error, results) => {
            if (error) return res.status(500).json(error);
            if (results.length > 0) {
                const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
                const query = "insert into comments (post_id, comments, created_at, user_id) values (?, ?, ?, ?)";
                connection.query(query, [id, comment, createdAt, userId], (error, results) => {
                    if (error) return res.status(500).json(error);
                    if (results.insertId) return res.status(200).json({ message: "Success" });
                    return res.status(400).json({ message: "Please Try again" })
                })
            } else {
                return res.status(404).json({ message: "No Data Found" })
            }
        })
    } catch (error) {
        return res.status(500).json(error)
    }

}

export const likePost = (req, res) => {
    const { id } = req.params;
    const userId = req.userId;
    if (!userId) return res.sendStatus(401);
    try {
        const query = "select * from posts where id = ?";
        connection.query(query, [id], (error, results) => {
            if (error) return res.status(500).json(error);
            if (results.length > 0) {

                const query = "select * from likes where user_id = ? and post_id = ?";
                connection.query(query, [userId, id], (error, results) => {
                    if (error) return res.status(500).json(error)
                    if (results.length > 0) {
                        const query = "delete from likes where post_id = ? and  user_id = ?";
                        connection.query(query, [id, userId], (error, results) => {
                            if (error) return res.status(500).json(error);
                            if (results.affectedRows > 0) return res.status(200).json({ message: "Success" });
                            return res.status(400).json({ message: "Please Try again" })
                        })
                    } else {
                        const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
                        const query = "insert into likes (post_id, user_id, created_at) values (?,?,?)";
                        connection.query(query, [id, userId, createdAt], (error, results) => {
                            if (error) return res.status(500).json(error)
                            if (results.insertId) return res.status(200).json({ message: "Success" });
                            return res.status(400).json({ message: "Please Try again" })
                        })
                    }
                })

            } else {
                return res.status(404).json({ message: "No Data Found" })
            }
        })
    } catch (error) {
        return res.status(500).json(error)
    }
}
