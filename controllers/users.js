import connection from "../connection.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const signUp = (req, res) => {
    const { fullname, email, mobile, password, confirmPassword } = req.body;
    if (password !== confirmPassword) return res.status(200).json({ message: "Password Not match" });
    try {
        const query = "select * from users where email = ?";
        connection.query(query, [email], async (error, results) => {
            if (error) return res.status(500).json({ error: error });
            if (results.length > 0) return res.status(400).json({ message: "Email Id already registered" });
            const hashPassword = await bcrypt.hash(password, 12);
            const query = "insert into users (email, password, mobile, fullname) values (?, ?, ?, ?)";
            connection.query(query, [email, hashPassword, mobile, fullname], async (error, results) => {
                if (error) return res.status(500).json({ error: error });
                const insertedId = results.insertId;
                const token = jwt.sign({ email, id: insertedId }, process.env.JWT, { expiresIn: '5hr' });
                return res.status(200).json({ message: "success", token: token });
            });
        });
    } catch (error) {
        return res.status(500).json({ error: error });
    }

}


export const signIn = (req, res) => {
    const { email, password } = req.body;
    try {
        const query = "select * from users where email = ?";
        connection.query(query, [email], async (error, results) => {
            if (error) return res.status(500).json({ error: error });
            if (results.length < 1) return res.status(400).json({ message: "Email Id not registered" });
            const isPasswordValid = await bcrypt.compare(password, results[0].password);
            if (!isPasswordValid) return res.status(400).json({ message: "Password Not match" });
            
            const token = jwt.sign({ email, id: results[0].id }, process.env.JWT, { expiresIn: '5hr' });

            return res.status(200).json({ message: "success", token: token });
            
          
        })
    } catch (error) {
        return res.status(500).json({ error: error });
    }


}