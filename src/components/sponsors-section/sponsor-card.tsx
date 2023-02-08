/*eslint-disable*/
import { Sponsor } from "models/sponsor";
import React, { useState } from "react";
import styles from '../../styles/Sponsors.module.css'
import Image from 'next/image'


interface SponsorCardProps extends Sponsor {
    isStaff?: boolean;
}

const SponsorCard: React.FC<SponsorCardProps> = (sponsor) => {
    return (
        <>
            <div className={styles.SponsorCard}>
                <a href={sponsor.url} target="_blank">
                    <div className={sponsor.isStaff ? styles.StaffCardBody : styles.SponsorCardBody}>
                        <Image unoptimized src={sponsor.logo}
                            fill
                            objectFit="scale-down"
                            alt={sponsor.name}
                            className={styles.SponsorCardBodyImage}></Image>
                    </div>
                </a>
            </div>
        </>
    );
}

export default SponsorCard;

