import { GalaxyGeneratorUpgrades } from "../globals";
import { AutobuyerState } from "./autobuyer";

export class GalaxyGeneratorUpgradeAutobuyerState extends AutobuyerState{
    get _upgradeName(){
        return ["additive", "multiplicative", "antimatterMult", "IPMult", "EPMult", "RSMult", "DTMult", "remnantPow", "exponential", "superExponential"][this.id-1];
    }

    get data(){
        const upgrades = player.auto.galgenUpgrades.all;
        while (upgrades.length < GalaxyGeneratorUpgradeAutobuyerState.entryCount) {
            upgrades.push({ isActive: false });
        }
        return upgrades[this.id-1];
    }

    get name(){
        return ["Additive", "Multiplicative", "Antimatter", "Infinity Point", "Eternity Point", "Reality Shard", "Dilated Time", "Remnant Power", "Galaxy Power", "Galaxy Dilation"][this.id-1];
    }

    get isUnlocked(){
        return (ChallengerUpgrade(8).isBought || ExpansionPack.pellePack.isBought) && Pelle.hasGalaxyGenerator;
    }

    get bulk(){
        return 0;
    }

    tick(){
        const upgradeName = this._upgradeName;
        GalaxyGeneratorUpgrades[upgradeName].purchase(DivinityMilestone.automaticDivinity.isReached);
    }

    static get entryCount(){
        return 10;
    }

    static get autobuyerGroupName(){ return "Galaxy Generator Upgrades"; }

    static get isActive(){ return player.auto.galgenUpgrades.isActive; }

    static set isActive(value){ player.auto.galgenUpgrades.isActive = value; }
}

export class GalaxyGeneratorSacrificeAutobuyerState extends AutobuyerState{
    get data(){
        return player.auto.galgenSac;
    }

    get name(){
        return "Galaxy Generator Sacrifice";
    }

    get isUnlocked(){
        return (ChallengerUpgrade(8).isBought || ExpansionPack.pellePack.isBought) && Pelle.hasGalaxyGenerator;
    }

    get bulk(){
        return 0;
    }

    tick(){
        if(GalaxyGenerator.isCapped) GalaxyGenerator.startSacrifice();
    }
}