
import { _decorator, Component, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ObjectRotator')
export class ObjectRotator extends Component {

    start() {
        let rot = new Vec3(0, -360, 0);
        let rotateTween = tween().by(10, { eulerAngles: rot });
        tween(this.node).repeatForever(rotateTween).start();
    }
}

