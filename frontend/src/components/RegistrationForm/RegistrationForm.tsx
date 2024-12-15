import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { uploadImage } from '../../imgbb';
import styles from './RegistrationForm.module.css';

const RegistrationForm: React.FC = () => {
    const [formData, setFormData] = useState({
        login: '',
        password: '',
        confirmPassword: '',
        name: '',
        nickname: '',
        phone: '',
        gender: '',
        avatar: null as File | null,
    });

    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (isSubmitting) {
            timeout = setTimeout(() => {
                setNotificationMessage('Отправка заняла слишком много времени. Пожалуйста, попробуйте позже.');
                showNotificationWithTimeout();
            }, 10000);
        }
        return () => clearTimeout(timeout);
    }, [isSubmitting]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, avatar: e.target.files[0] });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            let avatarUrl = '';
            if (formData.avatar) {
                avatarUrl = await uploadImage(formData.avatar);
            }

            const userCredential = await createUserWithEmailAndPassword(auth, formData.login, formData.password);
            const user = userCredential.user;

            await setDoc(doc(db, 'users', user.uid), {
                name: formData.name,
                nickname: formData.nickname,
                phone: formData.phone,
                gender: formData.gender,
                avatar: avatarUrl,
            });

            setError('');
            navigate(`/user/${user.uid}`);
        } catch (error) {
            setError(error.message);
            setNotificationMessage(error.message);
            showNotificationWithTimeout();
        } finally {
            setIsSubmitting(false);
        }
    };

    const generateRandomPassword = (length: number): string => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };

    const handleGeneratePassword = () => {
        const newPassword = generateRandomPassword(16);
        setFormData({ ...formData, password: newPassword, confirmPassword: newPassword });
    };

    const validateForm = (): boolean => {
        if (formData.password !== formData.confirmPassword) {
            setError('Пароли не совпадают');
            setNotificationMessage('Пароли не совпадают');
            showNotificationWithTimeout();
            return false;
        }

        if (!validateEmail(formData.login)) {
            setError('Некорректный формат email');
            setNotificationMessage('Некорректный формат email');
            showNotificationWithTimeout();
            return false;
        }

        if (!validateName(formData.name)) {
            setError('Некорректное имя');
            setNotificationMessage('Некорректное имя');
            showNotificationWithTimeout();
            return false;
        }

        if (!validateNickname(formData.nickname)) {
            setError('Некорректный никнейм');
            setNotificationMessage('Некорректный никнейм');
            showNotificationWithTimeout();
            return false;
        }

        if (!validatePhone(formData.phone)) {
            setError('Некорректный телефон');
            setNotificationMessage('Некорректный телефон');
            showNotificationWithTimeout();
            return false;
        }

        return true;
    };

    const showNotificationWithTimeout = () => {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
    };

    const validatePhone = (phone: string): boolean => {
        const phoneRegex = /^[+]375(24|25|29|33|44)[0-9]{7}$/;
        return phoneRegex.test(phone);
    };

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateName = (name: string): boolean => {
        const nameRegex = /^[a-zа-яА-ЯA-Z]+$/;
        return nameRegex.test(name);
    };

    const validateNickname = (nickname: string): boolean => {
        const nicknameRegex = /^[a-zа-яА-ЯA-Z0-9]+$/;
        return nicknameRegex.test(nickname);
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
                    type='password'
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="confirmPassword">Подтвердите пароль</label>
                <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type='password'
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="name">Имя</label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="nickname">Никнейм</label>
                <input
                    id="nickname"
                    name="nickname"
                    type="text"
                    value={formData.nickname}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="phone">Телефон</label>
                <input
                    id="phone"
                    name="phone"
                    type="text"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="gender">Пол</label>
                <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    defaultValue="male"
                >
                    <option value="male">Мужской</option>
                    <option value="female">Женский</option>
                    <option value="other">Другой</option>
                </select>
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="avatar">Аватар</label>
                <input
                    id="avatar"
                    name="avatar"
                    type="file"
                    onChange={handleFileChange}
                    required
                />
            </div>

            <div className={styles.formGroup}>
                <button type="button" onClick={handleGeneratePassword}>
                    Сгенерировать случайный пароль
                </button>
            </div>

            <div className={styles.formGroup}>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Отправка...' : 'Зарегистрироваться'}
                </button>
            </div>

            {error && showNotification && <div className={styles.error}>{error}</div>}
        </form>
    );
};

export default RegistrationForm;
