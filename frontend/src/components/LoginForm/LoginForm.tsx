import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import styles from './LoginForm.module.css';

const LoginForm: React.FC = () => {
    const [formData, setFormData] = useState({
        login: '',
        password: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value.trim() });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const userCredential = await signInWithEmailAndPassword(auth, formData.login, formData.password);
            navigate(`/user/${userCredential.user.uid}`);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
                <label htmlFor="login">Логин</label>
                <input
                    id="login"
                    name="login"
                    type="text"
                    value={formData.login}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="password">Пароль</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            </div>
            {error && <div className={styles.error}>{error}</div>}
            <div className={styles.formGroup}>
                <button type="submit">Войти</button>
            </div>
        </form>
    );
};

export default LoginForm;
