import React, { Component } from "react";
import {
    Modal,
    ModalBody
} from "reactstrap"

import styles from './styles.module.css'

class ModalPlayer extends Component<{ url: string; open: boolean; toggle: Function }> {
    render() {
        return (
            <Modal
                className={styles.Modal}
                isOpen={this.props.open}
                toggle={() => { this.props.toggle() }}
                backdrop={true}
                centered
                size="lg"
            >
                <ModalBody className={styles.ModalBody}>
                    <div className={styles.ModalWrapper}>
                        <iframe className={styles.ModalFrame} src={this.props.url} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                    </div>
                </ModalBody>
            </Modal>
        );
    }
}

export default ModalPlayer;
