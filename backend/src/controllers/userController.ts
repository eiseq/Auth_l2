import { Request, Response } from 'express';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

export const registerUser = async (req: Request, res: Response) => {
    const { login, password, name, nickname, phone, gender, avatar } = req.body;

    try {
        const userRef = doc(db, 'users', login);
        await setDoc(userRef, {
            name,
            nickname,
            phone,
            gender,
            avatar,
        });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
};
