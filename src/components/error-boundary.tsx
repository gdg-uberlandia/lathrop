
import React from "react";

interface IProps {
    children: React.Component
}

interface IState {
    hasError?: boolean;
}

class ErrorBoundary extends React.Component<IProps | {}, IState | {}, any> {
    public state: IState = {
        hasError: false
    };

    constructor(props: IProps) {
        super(props)

        // Define a state variable to track whether is an error or not
        this.state = { hasError: false }
    }
    static getDerivedStateFromError(error: any) {
        // Update state so the next render will show the fallback UI

        return { hasError: true }
    }
    componentDidCatch(error: any, errorInfo: any) {
        // You can use your own error logging service here
        console.log({ error, errorInfo })
    }
    render() {

        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div>
                    <h2>Oops, there is an error! </h2>
                    < button
                        type="button"
                        onClick={() => this.setState({ hasError: false })
                        }
                    >
                        Try again ?
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;