
import { _decorator, Component, assetManager, Asset, __private, AssetManager } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AssetBundle')
class AssetBundleData {
    @property private bundleId: string = "";
    @property private bundleUrl: string = "";
    private bundle?: AssetManager.Bundle;

    public set Bundle(value) { this.bundle = value; }
    public get Bundle() { return this.bundle; }

    public get BundleId() { return this.bundleId; }
    public get BundleUrl() { return this.bundleUrl; }
}

type AssetType<T = Asset> = __private._cocos_core_asset_manager_shared__AssetType<T>;
type SuccessCallback<T = any> = (data: T) => void;
type FailureCallback = (error: Error) => void;

@ccclass('AssetBundleHandler')
export class AssetBundleHandler extends Component {

    @property(AssetBundleData)
    private assetBundles: AssetBundleData[] = [];

    private static instance: AssetBundleHandler;
    public static get Instance() {
        return AssetBundleHandler.instance;
    }

    public onLoad() {
        if (!AssetBundleHandler.instance)
            AssetBundleHandler.instance = this;
        else
            this.node.destroy();
    }

    public getAssetBundleData(bundleId: string) {
        let bundleData = this.assetBundles.find(x => x.BundleId == bundleId);

        if (!bundleData) console.log("Bundle Data is missing.");

        return bundleData;
    }

    public getAssetBundle(bundleId: string) {
        let bundleData = this.getAssetBundleData(bundleId);
        let bundle = bundleData?.Bundle;

        if (!bundle) console.log("Bundle is not yet loaded.");

        return bundle;
    }

    public loadAssetBundle(bundleId: string, onSuccess: SuccessCallback<AssetManager.Bundle>, onFailure?: FailureCallback) {
        let bundleData = this.getAssetBundleData(bundleId);
        if (!bundleData) return;

        let bundleUrl = bundleData.BundleUrl;
        if (!bundleUrl) {
            console.log("Bundle URL is empty.");
            return;
        }

        assetManager.loadBundle(bundleUrl, (err, bundle) => {   //Load the asset bundle from the given URL. 
            if (err) {
                console.log(err);
                if (onFailure) onFailure(err);
                return;
            }

            console.log(`${bundle.name} Bundle loaded successfully.`);
            if (bundleData) bundleData.Bundle = bundle;
            if (onSuccess) onSuccess(bundle);
        });
    }

    public loadAsset<T extends Asset>(bundleId: string, assetPath: string, assetType: AssetType<T>, onSuccess: SuccessCallback<T>, onFailure?: FailureCallback) {
        let assetBundle = this.getAssetBundle(bundleId);

        if (!assetBundle) {     //If the bundle is not yet available, then load it first. 
            this.loadAssetBundle(bundleId, () => this.loadAsset(bundleId, assetPath, assetType, onSuccess, onFailure));
            return;
        }

        assetBundle?.load(assetPath, assetType, (err, asset) => {   //Load the asset from the bundle
            if (err) {
                console.log(err);
                if (onFailure) onFailure(err);
                return;
            }

            console.log(`${asset.name} Asset loaded successfully.`);
            if (onSuccess) onSuccess(asset);
        });
    }
}

