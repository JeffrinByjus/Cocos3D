
import { _decorator, Component, Node, Prefab, instantiate, director, EditBox } from 'cc';
import { AssetBundleHandler } from '../AssetBundle/AssetBundleHandler';
const { ccclass, property } = _decorator;

@ccclass('DemoManager')
export class DemoManager extends Component {

    @property(EditBox)
    private editBox!: EditBox;
    private nodes: Node[] = [];

    public loadAll() {
        AssetBundleHandler.Instance.loadAssetBundle("demo", (bundle) => {

            bundle.loadDir("/", Prefab, (err, assets) => {
                if (err) {
                    console.log(err);
                    return;
                }

                for (let asset of assets) {
                    let newNode = instantiate(asset);
                    let scene = director.getScene();
                    if (scene) scene.addChild(newNode);
                    newNode.setWorldPosition(0, 0, 0);
                    this.nodes.push(newNode);
                }
            });

        }, (err) => {
            console.log(err);
        });
    }

    public loadAsset() {
        let assetName = this.editBox.string;
        if (!assetName) return;

        AssetBundleHandler.Instance.loadAsset("demo", assetName, Prefab, (asset) => {
            let newNode = instantiate(asset);
            let scene = director.getScene();
            if (scene) scene.addChild(newNode);
            newNode.setWorldPosition(3, 0, 0);
            this.nodes.push(newNode);
        });
    }

    public clear() {
        if (this.nodes.length <= 0) return;

        this.nodes.forEach(x => x.destroy());
        this.nodes = [];
    }
}

