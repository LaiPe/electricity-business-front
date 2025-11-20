 import styles from './Spinner.module.css';

export default function Spinner({ small = false }) {
    return <div className={`${styles.spinner} ${small ? styles.small : ''}`}></div>;
}