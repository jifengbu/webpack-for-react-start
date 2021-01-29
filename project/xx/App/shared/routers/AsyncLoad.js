import React from 'react';
import { Spin } from 'antd';

export default function AsyncLoad (loader) {
    let prevModule = null;
    return class AsyncLoad extends React.Component {
        state = {
            loading: false,
            delay: false,
            Module: prevModule,
        };
        componentWillMount () {
            if (!this.state.Module) {
                this.setState({ loading: true, delay: true }, () => {
                    this._timeoutId = setTimeout(
                        () => {
                            this._timeoutId = null;
                            this.setState({ delay: false });
                        },
                        100,
                    );
                    loader(Module => {
                        if (this._timeoutId) {
                            this._timeoutId = null;
                            clearTimeout(this._timeoutId);
                        }
                        prevModule = Module;
                        this.setState({
                            loading: false,
                            Module,
                        });
                    });
                });
            }
        }
        render () {
            let { loading, delay, Module } = this.state;
            if (loading || delay) {
                return <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Spin /></div>;
            } else if (Module) {
                return <Module {...this.props} />;
            } else {
                return null;
            }
        }
    };
}
