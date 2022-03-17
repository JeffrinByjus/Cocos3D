
import { _decorator, Component, Node, MeshRenderer, EditBox, Material, Color, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MaterialDemo')
export class MaterialDemo extends Component {

    @property(Node)
    private cubes: Node[] = [];

    @property(EditBox)
    editBox!: EditBox;

    private material!: Material;

    onLoad() {
        this.material = new Material();
        this.material.initialize({
            effectName: 'builtin-standard',
            technique: 1
        });
    }

    private toggleTransparency() {
        let inputValue = this.editBox.string;
        let index = parseInt(inputValue);

        let mesh = this.cubes[index].getComponent(MeshRenderer);
        if (!mesh) return;

        mesh.setMaterialInstance(this.material, 0);
        let mat = mesh.getMaterialInstance(0);
        if (!mat) return;

        const pass = mat.passes[0];
        const hColor = pass.getHandle('albedo');
        const color = new Color(0, 255, 255, 20);

        tween(color).to(5, { a: 255 }, {
            'onUpdate': (target?: object, ratio?: number) => {
                pass.setUniform(hColor, color);
            }
        }).start();
    }

}