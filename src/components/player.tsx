import React, { Component } from "react";
import ReactPlayer from "react-player";
import {
    Modal
} from "reactstrap"

class Player extends Component<{ url: string; open: boolean; toggle: Function }> {
    render() {
        return (
            <Modal
                open={this.props.open}
                onClose={this.props.toggle}
                styles={{
                    modal: {
                        maxWidth: "unset",
                        width: "100%",
                        padding: "unset"
                    },
                    overlay: {
                        background: "rgba(0, 0, 0, 0.5)"
                    },
                    closeButton: {
                        background: "yellow"
                    }
                }}
                center
            >
                <ReactPlayer
                    url={this.props.url}
                    width="100%"
                    height="calc(100vh - 100px)"
                />
            </Modal>
        );
    }
}

export default Player;
