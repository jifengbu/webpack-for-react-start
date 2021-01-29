import React from 'react';
import styles from './index.less';

export default class CircleProgress extends React.Component {
    static defaultProps = {
        progress: 0,
        size: 80,
        thin: 10,
        bgColor: '#0C162B',
        backgroundColor: '#0F80FE',
        progressColor: '#22FFF0',
    };
    render () {
        const { size, thin, progress, backgroundColor, progressColor, bgColor } = this.props;
        let la, ra, lz;
        if (progress <= 50) {
            lz = 1;
            la = 0;
            ra = progress * 3.6 - 180;
        } else {
            lz = 0;
            la = progress * 3.6 - 360;
            ra = 0;
        }
        return (
            <div className={styles.container} style={{ width: size, height: size }}>
                <div className={styles.left} style={{ zIndex: lz, width: size / 2, height: size, borderTopLeftRadius: size, borderBottomLeftRadius: size, backgroundColor }} />
                <div className={styles.right} style={{ width: size / 2, height: size, borderTopRightRadius: size, borderBottomRightRadius: size, backgroundColor }} />
                <div className={styles.leftAfter} style={{ transform: `rotateZ(${la}deg)`, width: size / 2, height: size, borderTopLeftRadius: size, borderBottomLeftRadius: size, backgroundColor: progressColor }} />
                <div className={styles.rightAfter} style={{ transform: `rotateZ(${ra}deg)`, left: size / 2, width: size / 2, height: size, borderTopRightRadius: size, borderBottomRightRadius: size, backgroundColor: progressColor }} />
                <div className={styles.progress} style={{ zIndex: 2, width: size - thin * 2, height: size - thin * 2, left: thin, top: thin, backgroundColor: bgColor }} />
            </div>
        );
    }
}
