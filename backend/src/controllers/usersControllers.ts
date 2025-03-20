import { RequestHandler } from 'express';
import { hash } from '@node-rs/argon2';
import db from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

export const getAllUsers: RequestHandler = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM users');
        res.status(200).json({ users: rows });
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

export const getUserById: RequestHandler = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({ error: 'Missing id in parameters' });
    }

    try {
        const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [
            id,
        ]);
        const user = rows[0];
        res.status(200).json({ user: user });
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

export const createNewUser: RequestHandler = async (
    req,
    res,
): Promise<void> => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        res.status(400).json({ error: 'Missing email, username or password.' });
        return;
    }

    const uuid = uuidv4();

    try {
        const hashedPassword = await hash(password);

        const { rowCount: emailInUse } = await db.query(
            'SELECT * FROM users WHERE email = $1',
            [email],
        );

        const { rowCount: usernameInUse } = await db.query(
            'SELECT * FROM users WHERE username = $1',
            [username],
        );

        if (emailInUse) {
            res.status(409).json({ error: 'Email is already in use.' });
            return;
        }

        if (usernameInUse) {
            res.status(409).json({ error: 'Username is already in use.' });
            return;
        }

        await db.query(
            'INSERT INTO users (id, username, email, password) VALUES ($1, $2, $3, $4)',
            [uuid, username, email, hashedPassword],
        );

        res.status(201).json({ message: 'User registered successfully.' });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};
