import styles from "./styles.module.css"

interface CardProps {
  author: string;
  testimonial: string;
}

export const Card = ({
  author,
  testimonial,
}: CardProps) => {
    return (
        <div className={styles.TestimonialCard}>
            <h4 className={styles.TestimonialCard__title}>{author}</h4>
            <span className={styles.TestimonialCard__divider} />
            <p className={styles.TestimonialCard__testimonial}>{testimonial}</p>
        </div>
    )
}