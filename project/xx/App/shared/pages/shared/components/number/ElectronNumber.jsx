import React from 'react';
import { _ } from 'utils';

class NumberItem extends React.Component {
    render () {
        const { val, scale } = this.props;
        const list = [
            [ 0, 1, 2, 4, 5, 6 ],
            [ 1, 4 ],
            [ 0, 2, 3, 4, 6 ],
            [ 0, 2, 3, 5, 6 ],
            [ 1, 2, 3, 5 ],
            [ 0, 1, 3, 5, 6 ],
            [ 0, 1, 3, 4, 5, 6 ],
            [ 0, 2, 5 ],
            [ 0, 1, 2, 3, 4, 5, 6 ],
            [ 0, 1, 2, 3, 5, 6 ],
        ][val];
        return (
            <div style={val == 1 ? { textAlign: 'center', position: 'relative', width: 33 * scale } : { position: 'relative', width: 33 * scale }} >
                { _.includes(list, 0) && <img style={{ position: 'absolute', top: 0, width: 33 * scale, height: 7 * scale }} src='/sdclient/img/number/t.png' /> }
                { _.includes(list, 1) && <img style={{ position: 'absolute', top: 0, width: 7 * scale, height: 28 * scale }} src='/sdclient/img/number/vt.png' /> }
                { _.includes(list, 2) && <img style={{ position: 'absolute', left: 26 * scale, width: 7 * scale, height: 28 * scale }} src='/sdclient/img/number/vt.png' /> }
                { _.includes(list, 3) && <img style={{ position: 'absolute', top: 25 * scale, width: 33 * scale, height: 7 * scale }} src='/sdclient/img/number/m.png' /> }
                { _.includes(list, 4) && <img style={{ position: 'absolute', top: 29 * scale, width: 7 * scale, height: 28 * scale }} src='/sdclient/img/number/vb.png' /> }
                { _.includes(list, 5) && <img style={{ position: 'absolute', top: 29 * scale, left: 26 * scale, width: 7 * scale, height: 28 * scale }} src='/sdclient/img/number/vb.png' /> }
                { _.includes(list, 6) && <img style={{ position: 'absolute', top: 50 * scale, width: 33 * scale, height: 7 * scale }} src='/sdclient/img/number/b.png' /> }
            </div>
        );
    }
}
export default class ElectronNumber extends React.Component {
    static defaultProps = {
        scale: 1,
        gap: 4,
        style: {},
    };
    render () {
        const { children, scale, gap, className, style } = this.props;
        const numbers = ((children || '') + '').split('');
        const count = numbers.length;
        const width = ((33 + gap) * count) * scale;
        const height = 57 * scale;
        return (
            <div className={className} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', height, width, ...style }}>
                { numbers.map((o, k) => <NumberItem val={o} key={k} scale={scale} />) }
            </div>
        );
    }
}
