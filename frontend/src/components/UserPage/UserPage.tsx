import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import styles from './UserPage.module.css';

const UserPage: React.FC = () => {
    const { uid } = useParams<{ uid: string }>();
    const [userData, setUserData] = useState<any>(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDoc = await getDoc(doc(db, 'users', uid));
                if (userDoc.exists()) {
                    setUserData(userDoc.data());
                } else {
                    setError('Пользователь не найден');
                }
            } catch (error) {
                setError(error.message);
            }
        };

        fetchUserData();
    }, [uid]);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/');
        } catch (error) {
            setError(error.message);
        }
    };

    const handleUpdate = async (field: string, value: string) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', uid));
            if (userDoc.exists()) {
                await setDoc(doc(db, 'users', uid), {
                    [field]: value,
                }, { merge: true });
                setUserData(userDoc.data());
                location.reload();
            } else {
                setError('Пользователь не найден');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className={styles.userPage}>
            {userData ? (
                <>
                    <h1>Информация о пользователе</h1>
                    <p>Имя: {userData.name}</p>
                    <p>Никнейм: {userData.nickname}</p>
                    <p>Телефон: {userData.phone}</p>
                    <p>Пол: {userData.gender}</p>
                    <img src={userData.avatar} alt="Аватар пользователя" />
                    <button onClick={handleLogout}>Выйти</button>
                    <button onClick={() => handleUpdate('name', prompt('Введите новое имя:', ''))}>Изменить имя</button>
                    <button onClick={() => handleUpdate('nickname', prompt('Введите новый никнейм:', ''))}>Изменить никнейм</button>
                    <button onClick={() => handleUpdate('password', prompt('Введите новый пароль:', ''))}>Изменить пароль</button>
                    {error && <p className={styles.error}>{error}</p>}
                </>
            ) : (
                <p>Пользователь не найден</p>
            )}
        </div>
    );
};

export default UserPage;
